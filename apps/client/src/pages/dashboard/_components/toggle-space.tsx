import { t } from "@lingui/macro";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@apitool/ui";

import { useState } from "react";

export const ToggleSpace = () => {
  const [organization, setOrganization] = useState('Personal')

  const handleFiledChange = (value: string) => {
    setOrganization(value)
  }

  return (
    <Select value={organization} onValueChange={handleFiledChange}>
      <SelectTrigger>
        <SelectValue placeholder={organization} />
      </SelectTrigger>
      <SelectContent>
        {/* eslint-disable-next-line lingui/no-unlocalized-strings */}
        <SelectItem value="Personal">
          Personal
        </SelectItem>
        {/* eslint-disable-next-line lingui/no-unlocalized-strings */}
        <SelectItem value="Other">
          Other
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
