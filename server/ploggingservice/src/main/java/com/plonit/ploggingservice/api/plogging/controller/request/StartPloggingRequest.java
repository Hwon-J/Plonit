package com.plonit.ploggingservice.api.plogging.controller.request;

import com.plonit.ploggingservice.common.enums.Type;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Positive;

@Data
@Schema(description = "플로깅 시작 request")
public class StartPloggingRequest {
    
    @Schema(description = "플로깅 유형 / CREWPING, IND, VOL ")
    @NotBlank(message = "유형은 필수 입력값입니다.")
    @Pattern(regexp = "^(CREWPING|IND|VOL)$\n")
    private Type type;
    
    @Schema(description = "위도")
    @NotBlank(message = "위도는 필수 입력값입니다.")
    @Positive
    private Double latitude;
    
    @Schema(description = "경도")
    @NotBlank(message = "경도는 필수 입력값입니다.")
    @Positive
    private Double longitude;
    
    @Schema(description = "크루핑 id")
    private Long crewpingId;

    @Builder
    public StartPloggingRequest(Type type, Double latitude, Double longitude, Long crewpingId) {
        this.type = type;
        this.latitude = latitude;
        this.longitude = longitude;
        this.crewpingId = crewpingId;
    }
}