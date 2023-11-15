import React from "react";
import style from "styles/css/RankingPage/RankingItem.module.css";
import { RankInterface, CrewRankInterface } from "interface/rankInterface";

const FirstRankingItem = ({ data }: { data: RankInterface }) => {
  const firstItem = data.rankingList[0];
  console.log("firstItem: ", { firstItem });
  return (
    <div className={style.first_ranker}>
      <img className={style.crown} src="/crown.png" alt="왕관" />
      <img className={style.user} src={firstItem.profileImage} alt="몽" />

      <div className={style.nickname}>{firstItem.nickName}</div>
      <div className={style.dist}>
        <span className={style.large}>{firstItem.distance}</span>km
      </div>
    </div>
  );
};

export default FirstRankingItem;
