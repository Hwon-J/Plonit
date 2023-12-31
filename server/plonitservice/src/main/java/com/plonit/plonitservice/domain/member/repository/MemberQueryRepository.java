package com.plonit.plonitservice.domain.member.repository;

import com.plonit.plonitservice.api.member.controller.response.MemberRankRes;
import com.plonit.plonitservice.api.member.controller.response.VolunteerMemberInfoRes;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static com.plonit.plonitservice.domain.member.QMember.member;
import static com.querydsl.core.types.Projections.constructor;

@Repository
public class MemberQueryRepository {

    private final JPAQueryFactory queryFactory;

    public MemberQueryRepository(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Transactional(readOnly = true)
    public Boolean existKakaoId(long kakoId) {
        Integer fetchOne = queryFactory
                .selectOne()
                .from(member)
                .where(member.kakaoId.eq(kakoId))
                .fetchFirst();
        return fetchOne != null;
    }

    @Transactional(readOnly = true)
    public Boolean existEmail(String email) {
        Integer fetchOne = queryFactory
                .selectOne()
                .from(member)
                .where(member.email.eq(email))
                .fetchFirst();
        return fetchOne != null;
    }

    @Transactional(readOnly = true)
    public Boolean existNickname(String nickname) {
        Integer fetchOne = queryFactory
                .selectOne()
                .from(member)
                .where(member.nickname.eq(nickname))
                .fetchFirst();
        return fetchOne != null;
    }

    public List<MemberRankRes> findByIds(List<Long> memberIds) {
        return queryFactory.select(constructor(MemberRankRes.class,
                        member.id,
                        member.nickname,
                        member.profileImage))
                .from(member)
                .where(member.id.in(memberIds))
                .fetch();
    }

    public VolunteerMemberInfoRes findVolunteerMemberInfo(Long memberId) {
        return queryFactory.select(constructor(VolunteerMemberInfoRes.class,
                        member.id,
                        member.id1365,
                        member.name,
                        member.birth))
                .from(member)
                .where(member.id.eq(memberId))
                .fetchOne();
    }

    public List<Long> findByGugunCode(Long gugunCode) {
        return queryFactory.select(member.id)
                .from(member)
                .where(member.gugunCode.eq(gugunCode))
                .fetch();
    }

}