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

import static com.apitable.automation.enums.AutomationException.AUTOMATION_ROBOT_NOT_EXIST;
import static com.apitable.automation.enums.AutomationException.AUTOMATION_TRIGGER_LIMIT;
import static com.apitable.automation.model.ActionSimpleVO.actionComparator;
import static java.util.stream.Collectors.toList;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSON;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.apitable.automation.entity.AutomationActionEntity;
import com.apitable.automation.mapper.AutomationActionMapper;
import com.apitable.automation.model.ActionVO;
import com.apitable.automation.model.CreateActionRO;
import com.apitable.automation.model.TriggerCopyResultDto;
import com.apitable.automation.model.UpdateActionRO;
import com.apitable.automation.service.IAutomationActionService;
import com.apitable.automation.service.IAutomationActionTypeService;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.shared.config.properties.LimitProperties;
import com.apitable.shared.util.IdUtil;
import com.apitable.starter.databus.client.api.AutomationDaoApiApi;
import com.apitable.starter.databus.client.model.ApiResponseAutomationActionPO;
import com.apitable.starter.databus.client.model.AutomationActionPO;
import com.apitable.starter.databus.client.model.AutomationRobotActionRO;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import jakarta.annotation.Resource;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

/**
 * automation action service impl.
 */
@Slf4j
@Service
public class AutomationActionServiceImpl implements IAutomationActionService {

    public static final String EMAIL_SHOW_PASSWORD = "******";

    @Resource
    private AutomationActionMapper actionMapper;

    @Resource
    private LimitProperties limitProperties;

    @Resource
    private AutomationDaoApiApi automationDaoApiApi;

    @Resource
    private IAutomationActionTypeService iAutomationActionTypeService;

    @Override
    public void create(AutomationActionEntity action) {
        actionMapper.insert(action);
    }

    @Override
    public void copy(Long userId, Map<String, String> newRobotMap, TriggerCopyResultDto resultDto) {
        List<AutomationActionEntity> actions =
            actionMapper.selectByRobotIdIds(newRobotMap.keySet());
        if (CollUtil.isEmpty(actions)) {
            return;
        }
        Map<String, List<String>> robotIdToTriggerIdsMap = resultDto.getRobotIdToTriggerIdsMap();
        Map<String, String> newTriggerMap = resultDto.getNewTriggerMap();
        Map<String, String> newActionMap = actions.stream()
            .collect(Collectors.toMap(AutomationActionEntity::getActionId,
                i -> IdUtil.createAutomationActionId()));
        List<AutomationActionEntity> entities = new ArrayList<>(actions.size());
        for (AutomationActionEntity action : actions) {
            AutomationActionEntity entity = AutomationActionEntity.builder()
                .id(BigInteger.valueOf(IdWorker.getId()))
                .robotId(newRobotMap.get(action.getRobotId()))
                .actionTypeId(action.getActionTypeId())
                .actionId(newActionMap.get(action.getActionId()))
                .createdBy(userId)
                .updatedBy(userId)
                .build();
            if (action.getPrevActionId() != null) {
                entity.setPrevActionId(newActionMap.get(action.getPrevActionId()));
            }
            String input = action.getInput();
            if (input != null) {
                if (robotIdToTriggerIdsMap.containsKey(action.getRobotId())) {
                    for (String triggerId : robotIdToTriggerIdsMap.get(action.getRobotId())) {
                        input = input.replace(triggerId, newTriggerMap.get(triggerId));
                    }
                }
                entity.setInput(input);
            }
            entities.add(entity);
        }
        actionMapper.insertList(entities);
    }

    @Override
    public void updateActionTypeIdAndInputByRobotId(String robotId,
                                                    String actionTypeId, String input) {
        actionMapper.updateActionTypeIdAndInputByRobotId(robotId, actionTypeId, input);
    }

    @Override
    public List<ActionVO> createByDatabus(Long userId, CreateActionRO data) {
        AutomationRobotActionRO ro = new AutomationRobotActionRO();
        ro.setUserId(userId);
        ro.setInput(JSONUtil.toJsonStr(data.getInput()));
        ro.setPrevActionId(data.getPrevActionId());
        ro.setActionTypeId(data.getActionTypeId());
        ro.setLimitCount(Long.valueOf(limitProperties.getAutomationActionCount()));
        try {
            ApiResponseAutomationActionPO response =
                automationDaoApiApi.daoCreateOrUpdateAutomationRobotAction(data.getRobotId(), ro);
            ExceptionUtil.isFalse(
                AUTOMATION_ROBOT_NOT_EXIST.getCode().equals(response.getCode()),
                AUTOMATION_ROBOT_NOT_EXIST);
            ExceptionUtil.isFalse(
                AUTOMATION_TRIGGER_LIMIT.getCode().equals(response.getCode()),
                AUTOMATION_TRIGGER_LIMIT);
            return formatVoFromDatabusResponse(response.getData());
        } catch (RestClientException e) {
            log.error("Robot create action: {}", data.getRobotId(), e);
        }
        return new ArrayList<>();
    }


    @Override
    public void deleteByDatabus(String robotId, String actionId, Long userId) {
        AutomationRobotActionRO ro = new AutomationRobotActionRO();
        ro.setUserId(userId);
        ro.setIsDeleted(true);
        ro.setActionId(actionId);
        try {
            ApiResponseAutomationActionPO response =
                automationDaoApiApi.daoCreateOrUpdateAutomationRobotAction(robotId, ro);
            ExceptionUtil.isFalse(
                AUTOMATION_ROBOT_NOT_EXIST.getCode().equals(response.getCode()),
                AUTOMATION_ROBOT_NOT_EXIST);
        } catch (RestClientException e) {
            log.error("Delete action: {}", actionId, e);
        }
    }

    @Override
    public JSON handleActionInput(String input) {
        if (null == input) {
            return null;
        }
        JSONObject inputObj = JSONUtil.parseObj(input);
        if (inputObj.containsKey("value")) {
            JSONObject inputValue = JSONUtil.parseObj(inputObj.get("value"));
            if (inputValue.containsKey("operands")) {
                JSONArray operands = JSONUtil.parseArray(inputValue.get("operands"));
                if (operands.contains("password")) {
                    int passwordIndex = operands.indexOf("password");
                    Dict passwordValue =
                        new Dict().set("value", EMAIL_SHOW_PASSWORD).set("type", "Literal");
                    operands.set(passwordIndex + 1, passwordValue);
                }
                inputValue.set("operands", operands);
            }
            inputObj.set("value", inputValue);
        }
        return inputObj;
    }

    @Override
    public List<ActionVO> updateByDatabus(String actionId, Long userId, UpdateActionRO data) {
        // handle input
        String input = getActionInputStringFromRo(actionId, data.getInput());
        AutomationRobotActionRO ro = new AutomationRobotActionRO();
        ro.setUserId(userId);
        ro.setInput(input);
        ro.setPrevActionId(data.getPrevActionId());
        ro.setActionTypeId(data.getActionTypeId());
        ro.setActionId(actionId);
        try {
            ApiResponseAutomationActionPO response =
                automationDaoApiApi.daoCreateOrUpdateAutomationRobotAction(data.getRobotId(), ro);
            ExceptionUtil.isFalse(
                AUTOMATION_ROBOT_NOT_EXIST.getCode().equals(response.getCode()),
                AUTOMATION_ROBOT_NOT_EXIST);
            return formatVoFromDatabusResponse(response.getData());
        } catch (RestClientException e) {
            log.error("Robot update action: {}", data.getRobotId(), e);
        }
        return new ArrayList<>();
    }

    private String getActionInputStringFromRo(String actionId, Object inputObj) {
        String input = JSONUtil.toJsonStr(inputObj);
        if (null == input) {
            return null;
        }
        AutomationActionEntity action = actionMapper.selectByActionId(actionId);
        if (null == action) {
            return null;
        }
        // change send email input, should check password
        if (!input.equals(JSONUtil.toJsonStr(JSONUtil.createObj()))
            && iAutomationActionTypeService.isSendEmailAction(action.getActionTypeId())) {
            String newPassword = getSendEmailActionPassword(input);
            // should set old password to new password
            if (EMAIL_SHOW_PASSWORD.equals(newPassword)) {
                String oldPassword = getSendEmailActionPassword(action.getInput());
                return setSendEmailActionPassword(input, oldPassword);
            }
        }
        return input;
    }

    private List<ActionVO> formatVoFromDatabusResponse(List<AutomationActionPO> data) {
        if (null != data) {
            return data.stream().map(i -> {
                ActionVO vo = new ActionVO();
                vo.setActionId(i.getActionId());
                vo.setActionTypeId(i.getActionTypeId());
                vo.setPrevActionId(i.getPrevActionId());
                vo.setInput(handleActionInput(i.getInput()));
                return vo;
            }).sorted(actionComparator).collect(toList());
        }
        return new ArrayList<>();
    }

    private String getSendEmailActionPassword(String input) {
        if (null == input) {
            return null;
        }
        JSONObject inputObj = JSONUtil.parseObj(input);
        if (inputObj.containsKey("value")) {
            JSONObject inputValue = JSONUtil.parseObj(inputObj.get("value"));
            if (inputValue.containsKey("operands")) {
                JSONArray operands = JSONUtil.parseArray(inputValue.get("operands"));
                if (operands.contains("password")) {
                    int passwordIndex = operands.indexOf("password");
                    JSONObject passwordValue = JSONUtil.parseObj(operands.get(passwordIndex + 1));
                    return StrUtil.toString(passwordValue.get("value"));
                }
            }
        }
        return null;
    }

    private String setSendEmailActionPassword(String input, String password) {
        if (null == input) {
            return null;
        }
        JSONObject inputObj = JSONUtil.parseObj(input);
        if (inputObj.containsKey("value")) {
            JSONObject inputValue = JSONUtil.parseObj(inputObj.get("value"));
            if (inputValue.containsKey("operands")) {
                JSONArray operands = JSONUtil.parseArray(inputValue.get("operands"));
                if (operands.contains("password")) {
                    int passwordIndex = operands.indexOf("password");
                    Dict passwordValue =
                        new Dict().set("value", password).set("type", "Literal");
                    operands.set(passwordIndex + 1, passwordValue);
                }
                inputValue.set("operands", operands);
            }
            inputObj.set("value", inputValue);
        }
        return JSONUtil.toJsonStr(inputObj);
    }

}
