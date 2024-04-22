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

package com.apitable.automation.model;

import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.apitable.shared.support.serializer.NullObjectSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * AutomationRunTaskVO.
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AutomationRunTaskVO  {
    @Schema(description = "id", type = "java.lang.String")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String id;

    @Schema(description = "taskId", type = "java.lang.String")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String taskId;

    @Schema(description = "robotId", type = "java.lang.String")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String robotId;

    @Schema(description = "spaceId", type = "java.lang.String")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String spaceId;

    @Schema(description = "status", type = "java.lang.Integer")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer status;

    @Schema(description = "createdAt", type = "java.lang.String", example = "{}")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private LocalDateTime createdAt;

    @Schema(description = "Action input", type = "java.lang.String", example = "{}")
    @JsonSerialize(nullsUsing = NullObjectSerializer.class)
    private Object data;
}
