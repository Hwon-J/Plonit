package com.plonit.plonitservice.api.crewping.controller.response;

import com.plonit.plonitservice.domain.crewping.Crewping;
import com.plonit.plonitservice.domain.crewping.CrewpingMember;
import lombok.Builder;
import lombok.Data;

import static lombok.AccessLevel.PRIVATE;

@Data
@Builder(access = PRIVATE)
public class FindCrewpingRes {

    private Long crewpingId;
    private String name;
    private String crewpingImage;
    private String masterNickname;
    private String masterImage;
    private String place;
    private String startDate;
    private String endDate;
    private int cntPeople;
    private int maxPeople;
    private String introduce;

    public static FindCrewpingRes of(Crewping crewping, CrewpingMember master) {
        return FindCrewpingRes.builder()
                .crewpingId(crewping.getId())
                .name(crewping.getName())
                .crewpingImage(crewping.getCrewpingImage())
                .masterNickname(master.getMember().getNickname())
                .masterImage(master.getMember().getProfileImage())
                .place(crewping.getPlace())
                .startDate(crewping.getStartDate().toString())
                .endDate(crewping.getEndDate().toString())
                .cntPeople(crewping.getCntPeople())
                .maxPeople(crewping.getMaxPeople())
                .build();
    }

}