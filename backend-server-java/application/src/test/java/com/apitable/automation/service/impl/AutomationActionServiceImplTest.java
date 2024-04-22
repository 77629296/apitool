package com.apitable.automation.service.impl;

import static org.assertj.core.api.Assertions.assertThat;

import cn.hutool.core.io.IoUtil;
import cn.hutool.json.JSON;
import com.apitable.AbstractIntegrationTest;
import com.apitable.FileHelper;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

public class AutomationActionServiceImplTest extends AbstractIntegrationTest {

    @Test
    public void testHandActionInput() {
        InputStream inputStream = FileHelper.getInputStreamFromResource(
            "file/email_action_input.json");
        String jsonString = IoUtil.read(inputStream, StandardCharsets.UTF_8);
        JSON data = iAutomationActionService.handleActionInput(jsonString);
        assertThat(data).isNotNull();
    }

}
