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

package com.apitable.automation.mapper;

import com.apitable.automation.entity.AutomationRunHistoryEntity;
import com.apitable.automation.model.AutomationRunHistoryDTO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.time.LocalDate;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * automation history mapper.
 */
public interface AutomationRunHistoryMapper extends BaseMapper<AutomationRunHistoryEntity> {
    /**
     * query id by robot id and created at.
     *
     * @param spaceId space id
     * @param robotId robot id
     * @param startAt start times
     * @param endAt   end times
     * @param page    page
     * @return IPage NodeStatisticsDTO
     */
    IPage<Long> selectIdByRobotIdAndSpaceIdAndBetweenWithPage(@Param("robotId") String robotId,
                                                              @Param("spaceId") String spaceId,
                                                              @Param("startAt") LocalDate startAt,
                                                              @Param("endAt") LocalDate endAt,
                                                              Page<Void> page);

    /**
     * query base info.
     *
     * @param ids primary keys
     * @return AutomationRunHistoryDTO
     */
    List<AutomationRunHistoryDTO> selectByIds(@Param("ids") List<Long> ids);

    /**
     * query detail.
     *
     * @param taskId task id
     * @return AutomationRunHistoryEntity
     */
    AutomationRunHistoryEntity selectByTaskId(@Param("taskId") String taskId);
}
