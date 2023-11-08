import React, { useState } from "react";
import DefaultMap from "../DefaultMap";
import BottomUpModal from "../ploggingComps/BottomUpModal";
import CommonButton from "components/common/CommonButton";
import useGPS from "../functions/useGPS";

import { useDispatch, useSelector } from "react-redux";
import { rootState } from "store/store";
import * as P from "store/plogging-slice";

import { startPlogging } from "api/lib/plogging";

interface IBtnDiv {
  height: number;
  onClick?: () => void;
}

interface IPopUp {
  nickname?: string;
  onClick1?: () => void;
  onClick2?: () => void;
}

const BtnDiv: React.FC<IBtnDiv> = ({ height, onClick }) => {
  return (
    <div
      style={{
        height: `${height}px`,
        width: `100%`,
        transition: `all 200ms ease-in-out`,
      }}
    >
      <CommonButton
        text="시작하기"
        styles={{ backgroundColor: "#2cd261" }}
        onClick={onClick}
      />
    </div>
  );
};

const PopUp: React.FC<IPopUp> = ({ nickname, onClick1, onClick2 }) => {
  const styles = {
    backgroundColor: "#999999",
    fontWeight: "bolder",
    boxShadow: "3px 3px 3px #000000",
  };

  const TextComponent = () => {
    return (
      <div style={{ marginLeft: "1rem" }}>
        <div style={{ textAlign: "start" }}>
          <span
            style={{
              fontWeight: "bolder",
              fontSize: "1.5rem",
              marginBlockStart: 0,
            }}
          >
            {nickname}
          </span>
          <span>님,</span>
        </div>
        <div style={{ textAlign: "start" }}>플로깅 유형을 선택해주세요.</div>
      </div>
    );
  };

  return (
    <div>
      <TextComponent />
      <CommonButton text="자유 플로깅" styles={styles} onClick={onClick1} />
      <CommonButton text="봉사 플로깅" styles={styles} onClick={onClick2} />
    </div>
  );
};

const BeforeStart = () => {
  const btnDivHeight = useSelector<rootState, number>((state) => {
    const windowHeight = state.window.height;
    return windowHeight * 0.1;
  });
  const nickname = useSelector<rootState, string>((state) => {
    return state.user.nickname;
  });
  const accessToken = useSelector<rootState, string>((state) => {
    return state.user.accessToken;
  });
  const { latitude, longitude } = useGPS(); // 시작 시 GPS 정보 전달
  const [show, setShow] = useState<boolean>(false);
  const [preventShow, setPreventShow] = useState<boolean>(false);

  const dispatch = useDispatch();
  async function onClick1() {
    dispatch(P.clear());
    dispatch(P.setPloggingType("IND"));
    startPlogging({
      accessToken: accessToken,
      type: "IND",
      latitude: latitude,
      longitude: longitude,
      success: (response) => {
        console.log("개인 플로깅 선택");
        console.log(response);
        dispatch(P.setPloggingId(response.data.resultBody));
      },
      fail: (error) => {
        console.error(error);
      },
    });
    // dispatch(P.clear());
    // dispatch(P.setPloggingType("IND"));
  }
  async function onClick2() {
    dispatch(P.clear());
    dispatch(P.setPloggingType("VOL"));
    startPlogging({
      accessToken: accessToken,
      type: "VOL",
      latitude: latitude,
      longitude: longitude,
      success: (response) => {
        console.log("봉사 플로깅 선택");
        console.log(response);
        dispatch(P.setPloggingId(response.data.resultBody));
      },
      fail: (error) => {
        console.error(error);
      },
    });
    // dispatch(P.clear());
    // dispatch(P.setPloggingType("VOL"));
  }

  return (
    <>
      <DefaultMap subHeight={btnDivHeight} isBefore={true}>
        <BtnDiv
          height={btnDivHeight}
          onClick={() => {
            setPreventShow(true);
            setShow(true);
          }}
        />
      </DefaultMap>
      {preventShow && (
        <BottomUpModal show={show} setShow={setShow}>
          <PopUp nickname={nickname} onClick1={onClick1} onClick2={onClick2} />
        </BottomUpModal>
      )}
    </>
  );
};

export default BeforeStart;
