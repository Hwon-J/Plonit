package com.plonit.plonitservice.api.feed.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.plonit.plonitservice.api.feed.service.FeedService;
import com.plonit.plonitservice.api.feed.service.dto.SaveCommentDto;
import com.plonit.plonitservice.api.feed.service.dto.SaveFeedDto;
import com.plonit.plonitservice.common.AwsS3Uploader;
import com.plonit.plonitservice.common.exception.CustomException;
import com.plonit.plonitservice.common.exception.ErrorCode;
import com.plonit.plonitservice.common.util.RedisUtils;
import com.plonit.plonitservice.common.util.RequestUtils;
import com.plonit.plonitservice.domain.crew.Crew;
import com.plonit.plonitservice.domain.crew.CrewMember;
import com.plonit.plonitservice.domain.crew.repository.CrewMemberRepository;
import com.plonit.plonitservice.domain.crew.repository.CrewQueryRepository;
import com.plonit.plonitservice.domain.crew.repository.CrewRepository;
import com.plonit.plonitservice.domain.feed.Comment;
import com.plonit.plonitservice.domain.feed.Feed;
import com.plonit.plonitservice.domain.feed.FeedPicture;
import com.plonit.plonitservice.domain.feed.Like;
import com.plonit.plonitservice.domain.feed.repository.*;
import com.plonit.plonitservice.domain.member.Member;
import com.plonit.plonitservice.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.plonit.plonitservice.common.exception.ErrorCode.*;
import static com.plonit.plonitservice.common.util.LogCurrent.*;
import static com.plonit.plonitservice.common.util.LogCurrent.END;

@Slf4j
@RequiredArgsConstructor
@Service
public class FeedServiceImpl implements FeedService {

    private final CrewRepository crewRepository;
    private final CrewQueryRepository crewQueryRepository;
    private final CrewMemberRepository crewMemberRepository;
    private final FeedRepository feedRepository;
    private final FeedQueryRepository feedQueryRepository;
    private final FeedPictureRepository feedPictureRepository;
    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;
    private final AwsS3Uploader awsS3Uploader;
    private final RedisUtils redisUtils;
    private final LikeRepository likeRepository;
    private final LikeQueryRepository likeQueryRepository;

    @Transactional // 피드 등록
    public void saveFeed(SaveFeedDto saveFeedDto) {
        log.info(logCurrent(getClassName(), getMethodName(), START));
        Member member = memberRepository.findById(saveFeedDto.getMemberKey())
                .orElseThrow(() -> new CustomException(USER_BAD_REQUEST));

        Crew crew = crewQueryRepository.findCrewWithMember(saveFeedDto.getMemberKey(), saveFeedDto.getCrewId())
                .orElseThrow(() -> new CustomException(CREW_NOT_FORBIDDEN));

        Feed feed = feedRepository.save(SaveFeedDto.toEntity(member, crew, saveFeedDto));

        List<MultipartFile> multipartFiles = saveFeedDto.getFeedPictures();
        List<String> feedImageUrl = new ArrayList<>();
        for(MultipartFile item : multipartFiles) {
            if (item != null) {
                try {
                    feedImageUrl.add(awsS3Uploader.uploadFile(item, "feed/" + saveFeedDto.getCrewId() + "/" + feed.getId()));
                } catch (IOException e) {
                    throw new CustomException(S3_CONNECTED_FAIL);
                }
            }
        }

        List<FeedPicture> feedPictures = feedImageUrl.stream().map(url -> FeedPicture.toEntity(feed, url))
                .collect(Collectors.toList());
        feedPictureRepository.saveAll(feedPictures);
        log.info(logCurrent(getClassName(), getMethodName(), END));
    }
    @Transactional // 피드 삭제
    public void deleteFeed(Long memberKey, Long feedId) {
        log.info(logCurrent(getClassName(), getMethodName(), START));

        Feed feed = feedRepository.findByIdAndMember_Id(feedId, memberKey)
                .orElseThrow(() -> new CustomException(FEED_NOT_FORBIDDEN));
        feed.changeDelete();

        log.info(logCurrent(getClassName(), getMethodName(), END));
    }

    @Transactional // 댓글 등록
    public void saveComment(SaveCommentDto saveCommentDto) {
        log.info(logCurrent(getClassName(), getMethodName(), START));

        Member member = memberRepository.findById(saveCommentDto.getMemberKey())
                .orElseThrow(() -> new CustomException(USER_BAD_REQUEST));

        // 해당 피드를 등록한 크루에 가입되어 있다면 댓글 등록 가능
        Feed feed = feedQueryRepository.findFeedWithCrewMember(saveCommentDto.getFeedId(), saveCommentDto.getMemberKey())
                .orElseThrow(() -> new CustomException(FEED_NOT_FORBIDDEN));

        commentRepository.save(SaveCommentDto.toEntity(member, feed, saveCommentDto));

        log.info(logCurrent(getClassName(), getMethodName(), END));
    }

    @Transactional // 댓글 삭제
    public void deleteComment(Long memberKey, Long commentId) {
        log.info(logCurrent(getClassName(), getMethodName(), START));

        Comment comment = commentRepository.findByIdAndMember_Id(commentId, memberKey)
                .orElseThrow(() -> new CustomException(FEED_COMMENT_NOT_FORBIDDEN));

        commentRepository.delete(comment);
        log.info(logCurrent(getClassName(), getMethodName(), END));
    }

    @Override
    public boolean saveFeedLike(Long feedId) {
        Long memberId = RequestUtils.getMemberId();

        Feed feed = feedRepository.findById(feedId)
                .orElseThrow(() -> new CustomException(FEED_NOT_FOUND));

        String key = "FEED_LIKE:" + feedId;
        Boolean isValue = redisUtils.isRedisSetValue(key, String.valueOf(memberId));

        boolean flag = false;
        if(!isValue) {
            Like like = likeQueryRepository.findLikeByMemberAndFeed(memberId, feedId);

            // 좋아요 취소가 이루어짐
            if(like != null) {
                dislikeFeed(memberId, feedId, false, like);
            }
            // 좋아요 등록이 이루어짐
            else {
                likeFeed(memberId, feedId);
                flag = true;
            }
        }
        // 좋아요 취소가 이루어짐
        else {
            dislikeFeed(memberId, feedId, true, null);
        }

        return flag;
    }

    @Override
    public void likeFeed(Long memberId, Long feedId)  {
        String feedKey = "FEED_LIKE:" + feedId;
        redisUtils.setRedisSet(feedKey, String.valueOf(memberId));

        String countKey = "FEED_COUNT:" + feedId;
        Integer likeCount = null;

        String value = redisUtils.getRedisValue(countKey);
        if(value != null) {
            likeCount = Integer.valueOf(value);
        }

        if(likeCount == null) {
            Feed feed = feedRepository.findById(feedId)
                    .orElseThrow(() -> new CustomException(FEED_NOT_FOUND));
            System.out.println("FEED 테이블에 저장된 값: " + feed.getLikeCount());

            likeCount = feed.getLikeCount() + 1;

            redisUtils.setRedisValue(countKey, String.valueOf(likeCount));
        }
        else {
            redisUtils.setRedisValue(countKey, String.valueOf(likeCount + 1));
        }
    }

    @Override
    public void dislikeFeed(Long memberId, Long feedId, Boolean isRedis, Like like) {
        if(isRedis) {
            String feedKey = "FEED_LIKE:" + feedId;
            redisUtils.deleteRedisSet(feedKey, String.valueOf(memberId));
        }
        else {
            likeRepository.delete(like);
        }

        String countKey = "FEED_COUNT:" + feedId;
        Integer likeCount = null;

        String value = redisUtils.getRedisValue(countKey);
        if(value != null) {
            likeCount = Integer.valueOf(value);
        }

        if(likeCount == null) {
            Feed feed = feedRepository.findById(feedId)
                    .orElseThrow(() -> new CustomException(FEED_NOT_FOUND));

            likeCount = feed.getLikeCount() - 1;

            redisUtils.setRedisValue(countKey, String.valueOf(likeCount));
        }
        else {
            redisUtils.setRedisValue(countKey, String.valueOf(likeCount - 1));
        }
    }

}
