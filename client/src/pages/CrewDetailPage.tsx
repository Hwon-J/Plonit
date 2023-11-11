import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { userActions } from "store/user-slice";
import { BackTopBar } from "components/common/TopBar";
import CrewLeader from "components/CrewDetail/CrewLeader";
import CrewInfo from "components/CrewDetail/CrewInfo";
import CrewRanking from "components/CrewDetail/CrewRanking";
import CrewIntroduce from "components/CrewDetail/CrewIntroduce";
import CommonButton from "components/common/CommonButton";
import { getCrewDetail, getCrewQuit } from "api/lib/crew";
import { CrewInterface } from "interface/crewInterface";

const CrewDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state: any) => state.user.auth.accessToken);
  const User = useSelector((state: any) => state.user);
  const { crewId } = useParams();
  console.log(crewId);
  const [isCrewDetail, setCrewDetail] = useState<CrewInterface>(
    {} as CrewInterface,
  );

  useEffect(() => {
    getCrewDetail(
      accessToken,
      Number(crewId),
      (res) => {
        console.log("크루 상세 조회 성공");
        console.log(res.data);
        setCrewDetail(res.data.resultBody);
        const data = {
          isMyCrew: res.data.resultBody.isMyCrew,
          isCrewMaster: res.data.resultBody.isCrewMaster,
          isCrewwpingMaster: User.crewinfo.isCrewwpingMaster,
        };
        dispatch(userActions.myCrewHandler(data));
      },
      (err) => {
        console.log("크루 상세 조회 실패", err);
      },
    );
  }, []);

  const CrewQuit = () => {
    alert("크루를 탈퇴하시겠습니까");
    getCrewQuit(
      accessToken,
      Number(crewId),
      (res) => {
        console.log("크루 탈퇴 요청 성공");
        console.log(res.data);
        navigate(`/crew/community/${crewId}`);
      },
      (err) => {
        console.log("크루 탈퇴 요청 실패", err);
      },
    );
  };

  return (
    <div>
      <BackTopBar text={isCrewDetail.name} />
      <div>
        <CrewLeader crew={isCrewDetail} />
        <CrewInfo crew={isCrewDetail} />
        <CrewRanking crew={isCrewDetail} />
        <CrewIntroduce crew={isCrewDetail} />
      </div>
      {isCrewDetail.isMyCrew ? (
        <CommonButton
          text="크루 탈퇴"
          styles={{
            backgroundColor: "gray",
          }}
          onClick={CrewQuit}
        />
      ) : null}
    </div>
  );
};

export default CrewDetailPage;
