import React, { useState, useEffect } from "react";
import DefaultMap from "../DefaultMap";
import CommonButton from "components/common/CommonButton";
import CenterModal from "../ploggingComps/CenterModal";
import { Member } from "interface/ploggingInterface";
import style from "styles/css/PloggingPage/BeforeCrewping.module.css";

import { useDispatch, useSelector } from "react-redux";
import { rootState } from "store/store";
import * as P from "store/plogging-slice";
import * as Crewping from "store/crewping-slice";

interface IBtnDiv {
  height: number;
  onClick?: () => void;
}

const BtnDiv: React.FC<IBtnDiv> = ({ height, onClick }) => {
  const isLoading = useSelector<rootState, boolean>((state) => {
    return state.crewping.isLoading;
  });

  return (
    <div
      style={{
        height: `${height}px`,
        width: `100%`,
        transition: `all 200ms ease-in-out`,
      }}
    >
      <CommonButton
        text={isLoading ? "크루핑 대기 중" : "크루핑 참여하기"}
        styles={{ backgroundColor: `${isLoading ? "#999999" : "#2cd261"}` }}
        onClick={onClick}
      />
    </div>
  );
};

const Waiting = ({ setShow }: { setShow: (value: boolean) => void }) => {
  const dispatch = useDispatch();
  const windowHeight = useSelector<rootState, number>((state) => {
    return state.window.height;
  });
  const isCharge = useSelector<rootState, boolean>((state) => {
    return state.crewping.charge;
  });
  const members = useSelector<rootState, Member[]>((state) => {
    return state.crewping.members;
  });

  return (
    <div>
      <div className={style.waiting_top}>
        <div>함께할 그룹원과</div>
        <div>플로깅을 시작하세요!</div>
      </div>
      <div
        className={style.wrapper}
        style={{ maxHeight: `${0.25 * windowHeight}px` }}
      >
        {members.map((member) => {
          return (
            <div key={member.nickName} className={style.user}>
              <div
                className={style.profile_image}
                style={{
                  backgroundImage: `url(${member.profileImage})`,
                }}
              ></div>
              <div className={style.nickname}>{member.nickName}</div>
            </div>
          );
        })}
      </div>
      {isCharge ? (
        <CommonButton
          text="크루핑 시작하기"
          styles={{
            backgroundColor: "#2cd261",
          }}
          onClick={() => {
            setShow(false);
            dispatch(Crewping.setStartRequest(true));
          }}
        />
      ) : (
        <div>
          <div className={style.waiting_bot}>{`크루핑 대기 중`}</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className={style["dot-flashing"]}></div>
          </div>
          <CommonButton
            text="크루핑 중지"
            styles={{ backgroundColor: "#999999" }}
            onClick={() => {
              setShow(false);
              dispatch(Crewping.setExitRequest());
            }}
          />
        </div>
      )}
    </div>
  );
};

const BeforeCrewping = () => {
  const dispatch = useDispatch();

  const btnDivHeight = useSelector<rootState, number>((state) => {
    const windowHeight = state.window.height;
    return windowHeight * 0.1;
  });
  const [show, setShow] = useState<boolean>(false);

  function onClick() {
    dispatch(Crewping.setIsLoading(true));
    setShow(true);
  }

  return (
    <>
      <DefaultMap subHeight={btnDivHeight} isBefore={true}>
        <BtnDiv height={btnDivHeight} onClick={onClick} />
      </DefaultMap>
      <CenterModal setShow={setShow} show={show}>
        <Waiting setShow={setShow} />
      </CenterModal>
    </>
  );
};

export default BeforeCrewping;
