/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.automation.service.impl;

import static com.apitable.automation.service.impl.AutomationActionServiceImpl.EMAIL_SHOW_PASSWORD;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSON;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.apitable.automation.entity.AutomationRunHistoryEntity;
import com.apitable.automation.mapper.AutomationRunHistoryMapper;
import com.apitable.automation.model.AutomationRunHistoryDTO;
import com.apitable.automation.model.AutomationRunTaskVO;
import com.apitable.automation.model.AutomationTaskSimpleVO;
import com.apitable.automation.service.IAutomationRunHistoryService;
import com.apitable.shared.clock.spring.ClockManager;
import com.apitable.workspace.enums.IdRulePrefixEnum;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Automation run history interface implement.
 */
@Slf4j
@Service
public class AutomationRunHistoryServiceImpl
    extends ServiceImpl<AutomationRunHistoryMapper, AutomationRunHistoryEntity>
    implements IAutomationRunHistoryService {

    @Override
    public List<AutomationTaskSimpleVO> getRobotRunHistory(String spaceId, String robotId,
                                                           Page<Void> page) {
        LocalDate date = LocalDate.now().plusDays(1);
        IPage<Long> historyIds =
            baseMapper.selectIdByRobotIdAndSpaceIdAndBetweenWithPage(robotId, spaceId,
                getPreviousMonthFirstDay(date), date, page);
        if (historyIds.getRecords().isEmpty()) {
            return new ArrayList<>();
        }
        List<AutomationRunHistoryDTO> runHistories =
            baseMapper.selectByIds(historyIds.getRecords());
        return runHistories.stream().map(this::formatTaskSimpleVo).toList();
    }

    @Override
    public AutomationRunTaskVO getByTaskDetail(String taskId) {
        AutomationRunHistoryEntity task = baseMapper.selectByTaskId(taskId);
        if (ObjectUtil.isNull(task)) {
            return null;
        }
        AutomationRunTaskVO vo = new AutomationRunTaskVO();
        vo.setTaskId(task.getTaskId());
        vo.setId(task.getId().toString());
        vo.setId(task.getRobotId());
        vo.setStatus(task.getStatus());
        vo.setSpaceId(task.getSpaceId());
        vo.setRobotId(task.getRobotId());
        vo.setData(formatExecuteData(task.getData()));
        return vo;
    }

    private LocalDate getPreviousMonthFirstDay(LocalDate date) {
        return date.minusMonths(1).withDayOfMonth(1);
    }

    private AutomationTaskSimpleVO formatTaskSimpleVo(AutomationRunHistoryDTO history) {
        AutomationTaskSimpleVO vo = new AutomationTaskSimpleVO();
        vo.setRobotId(history.getRobotId());
        vo.setStatus(history.getStatus());
        vo.setTaskId(history.getTaskId());
        vo.setCreatedAt(
            history.getCreatedAt().atZone(ClockManager.me().getDefaultTimeZone()).toInstant()
                .toEpochMilli());
        if (StrUtil.isNotBlank(history.getActionIds())) {
            List<AutomationTaskSimpleVO.ActionExecutionVO> executions = new ArrayList<>();
            List<Object> actionIds = JSONUtil.parseArray(history.getActionIds());
            List<Object> actionTypeIds = JSONUtil.parseArray(history.getActionTypeIds());
            List<Object> errorMessages = JSONUtil.parseArray(history.getErrorMessages());
            for (int i = 0; i < actionIds.size(); i++) {
                AutomationTaskSimpleVO.ActionExecutionVO execution =
                    new AutomationTaskSimpleVO.ActionExecutionVO();
                // exclude trigger
                if (!StrUtil.startWith(actionIds.get(i).toString(),
                    IdRulePrefixEnum.AUTOMATION_TRIGGER.getIdRulePrefixEnum())) {
                    execution.setActionId(actionIds.get(i).toString());
                    execution.setActionTypeId(actionTypeIds.get(i).toString());
                    execution.setSuccess(ObjectUtil.isNull(CollUtil.get(errorMessages, i)));
                    executions.add(execution);
                }
            }
            vo.setExecutedActions(executions);
        }
        return vo;
    }

    private JSON formatExecuteData(String dataStr) {
        JSONObject data = JSONUtil.parseObj(dataStr);
        // handle multi triggers
        JSONArray executedNodeIds = data.getJSONArray("executedNodeIds");
        if (null != executedNodeIds) {
            executedNodeIds.removeIf(i -> {
                int index = executedNodeIds.indexOf(i);
                return 0 != index && i.toString()
                    .startsWith(IdRulePrefixEnum.AUTOMATION_TRIGGER.getIdRulePrefixEnum());
            });
            data.set("executedNodeIds", executedNodeIds);
        }
        // handle send mail action password
        JSONObject nodeByIds = data.getJSONObject("nodeByIds");
        if (null != nodeByIds) {
            for (Object executedNodeId : nodeByIds.keySet()) {
                if (executedNodeId.toString()
                    .startsWith(IdRulePrefixEnum.AUTOMATION_ACTION.getIdRulePrefixEnum())) {
                    JSONObject executedAction = nodeByIds.getJSONObject(executedNodeId.toString());
                    JSONObject actionInput = executedAction.getJSONObject("input");
                    if (null != actionInput && actionInput.containsKey("password")) {
                        actionInput.set("password", EMAIL_SHOW_PASSWORD);
                        executedAction.set("input", actionInput);
                        nodeByIds.set(executedNodeId.toString(), executedAction);
                        data.set("nodeByIds", nodeByIds);
                    }
                }
            }
        }
        return data;
    }
}
