package com.plonit.plonitservice.api.badge.controller;

import com.plonit.plonitservice.api.badge.controller.request.BadgeReq;
import com.plonit.plonitservice.api.badge.controller.request.CrewBadgeReq;
import com.plonit.plonitservice.api.badge.controller.request.MembersBadgeReq;
import com.plonit.plonitservice.api.badge.service.BadgeService;
import com.plonit.plonitservice.api.badge.service.dto.BadgeDto;
import com.plonit.plonitservice.api.badge.service.dto.CrewBadgeDto;
import com.plonit.plonitservice.api.badge.service.dto.MembersBadgeDto;
import com.plonit.plonitservice.common.CustomApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Tag(name = "Badge NO AUTH API Controller", description = "Badge API Document")
@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/plonit-service/na/badge")
public class BadgeNaApiController {
    
    private final BadgeService badgeService;
    
    @Operation(summary = "[관리자용] 배지 설정", description = "배지를 설정합니다.")
    @PostMapping("/setting")
    public CustomApiResponse<Void> saveBadge(
            @ModelAttribute BadgeReq req
            ) {

        log.info("saveBadge = {}", req.toString());
        // 배지 설정
        badgeService.saveBadge(BadgeDto.of(req));
        
        return CustomApiResponse.ok(null);
    }

    @Operation(summary = "[관리자용] 개인 배지 부여", description = "개인 배지를 부여합니다.")
    @PostMapping("/member-grant")
    public CustomApiResponse<Void> saveBadgeByIndividual(
            @RequestBody List<MembersBadgeReq> reqs
    ) {
        // 개인 배지 부여
        List<MembersBadgeDto> membersBadgeDtos = new ArrayList<>();
        for (MembersBadgeReq req : reqs) {
            membersBadgeDtos.add(MembersBadgeDto.of(req));
        }
        badgeService.saveBadgeByIndividual(membersBadgeDtos);
        
        return CustomApiResponse.ok(null);
    }
    
    
    @Operation(summary = "[관리자용] 크루 배지 부여", description = "크루 배지를 부여합니다.")
    @PostMapping("/crew-grant")
    public CustomApiResponse<Void> saveBadgeByCrew(
            @RequestBody List<CrewBadgeReq> reqs
    ) {
        // 크루 배지 부여
        List<CrewBadgeDto> crewBadgeDtos = new ArrayList<>();
        for (CrewBadgeReq req : reqs) {
            crewBadgeDtos.add(CrewBadgeDto.of(req));
        }
        badgeService.saveBadgeByCrew(crewBadgeDtos);
        
        return CustomApiResponse.ok(null);
    }
    
}
