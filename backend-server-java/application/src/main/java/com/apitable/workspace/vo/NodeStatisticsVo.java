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

package com.apitable.workspace.vo;

import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * Node Statistics View.
 */
@Data
@Schema(description = "Node Statistics View")
public class NodeStatisticsVo {

    @Schema(description = "Member name")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String memberName;

    @Schema(description = "Member id")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String memberId;

    @Schema(description = "avatar")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String avatar;

    @Schema(description = "avatar color, used for empty avatar")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private Integer avatarColor;

    @Schema(description = "team name, contact with & ")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String teamName;

    @Schema(description = "user's total Node counts")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer totalNodeCount;

    @Schema(description = "user's private node counts")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer privateNodeCount;

    @Schema(description = "team node counts, teamNodeCount = totalNodeCount - privateNodeCount")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer teamNodeCount;
}
