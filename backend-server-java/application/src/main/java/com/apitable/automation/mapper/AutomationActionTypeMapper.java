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

import com.apitable.automation.entity.AutomationActionTypeEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

/**
 * action type mapping.
 */
public interface AutomationActionTypeMapper extends BaseMapper<AutomationActionTypeEntity> {

    /**
     * Get action type by endpoint.
     *
     * @param endpoint  invocation interface
     * @return action type
     */
    String getActionTypeIdByEndpoint(@Param("endpoint") String endpoint);

    Long selectIdByActionTypeId(@Param("actionTypeId") String actionTypeId);

    /**
     * query endpoint.
     *
     * @param actionTypeId action type id
     * @return endpoint
     */
    String selectEndpointByActionTypeId(@Param("actionTypeId") String actionTypeId);
}
