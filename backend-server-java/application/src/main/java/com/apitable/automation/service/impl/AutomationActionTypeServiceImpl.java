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

import cn.hutool.core.util.StrUtil;
import com.apitable.automation.enums.AutomationActionType;
import com.apitable.automation.mapper.AutomationActionTypeMapper;
import com.apitable.automation.service.IAutomationActionTypeService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * action type service implementation.
 */
@Slf4j
@Service
public class AutomationActionTypeServiceImpl implements IAutomationActionTypeService {

    @Resource
    private AutomationActionTypeMapper actionTypeMapper;

    @Override
    public String getActionTypeIdByEndpoint(String endpoint) {
        return actionTypeMapper.getActionTypeIdByEndpoint(endpoint);
    }

    @Override
    public boolean isSendEmailAction(String actionTypeId) {
        String endpoint = actionTypeMapper.selectEndpointByActionTypeId(actionTypeId);
        return StrUtil.equals(endpoint, AutomationActionType.SEND_MAIL.getType());
    }

}
