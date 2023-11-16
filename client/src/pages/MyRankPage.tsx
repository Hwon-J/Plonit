import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BackTopBar } from "components/common/TopBar";
import MyRankMain from "components/MyRank/MyRankMain";
import MyRankItem from "components/MyRank/MyRankItem";
import style from "styles/css/MyRankPage.module.css";
import { MyRankInterface } from "interface/rankInterface";
import { getMyRanking } from "api/lib/members";

const MyRankPage = () => {
  const accessToken = useSelector((state: any) => state.user.auth.accessToken);
  const [isMyRanking, setMyRanking] = useState<MyRankInterface[]>([]);

  useEffect(() => {
    getMyRanking(
      accessToken,
      (res) => {
        console.log("나의 랭킹 조회 성공");
        console.log(res.data);
        setMyRanking(res.data.resultBody);
      },
      (err) => {
        console.log("나의 랭킹 조회 실패", err);
      },
    );
  }, []);
  console.log(isMyRanking);
  return (
    <div>
      <BackTopBar text="나의 랭킹" />

      <div className={style.page_container}>
        <div className={style.myrank_container}>
          <div className={style.season_info_container}>
            <div className={style.season_title}>10-2 시즌</div>
            <div className={style.season_date}>(10월 16일 ~ 10월 31일)</div>
          </div>
          <div className={style.current_container}>
            <MyRankMain />
          </div>
        </div>

        <div className={style.prev_container}>
          <div className={style.prev_info_container}>
            <div className={style.prev_title}>지난 랭킹</div>
          </div>

          <div className={style.prev_item_container}>
            <MyRankItem />
            <MyRankItem />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRankPage;
