import { AxiosResponse } from "axios";
import { customApi, customApiForm } from "./index";
import { Coordinate } from "interface/ploggingInterface";

const ploggingApi = customApi(`/plogging-service/v1`);
const ploggingApiForm = customApiForm(`/plogging-service/v1`);

// 1. 플로깅 기록 저장
const savePlogging = ({
  accessToken,
  ploggingId,
  coordinates,
  distance,
  calorie,
  review,
  success,
  fail,
}: {
  accessToken: string;
  ploggingId: number;
  coordinates: Coordinate[];
  distance: number;
  calorie: number;
  review: string;
  success: (response: AxiosResponse<any, any>) => void | undefined;
  fail: (error: any) => void | undefined;
}) => {
  const api = ploggingApi;
  api.defaults.headers["accessToken"] = `Bearer ${accessToken}`;
  api
    .post(
      ``,
      JSON.stringify({
        ploggingId: ploggingId,
        coordinates: coordinates,
        distance: distance,
        calorie: calorie,
        review: review,
      }),
    )
    .then(success)
    .catch(fail);
};

// 플로깅 시작하기
const startPlogging = ({
  accessToken,
  type,
  latitude,
  longitude,
  crewpingId,
  success,
  fail,
}: {
  accessToken: string;
  type: "IND" | "VOL" | "CREWPING";
  latitude: number;
  longitude: number;
  crewpingId?: number;
  success: (response: AxiosResponse<any, any>) => void | undefined;
  fail: (error: any) => void | undefined;
}) => {
  const api = ploggingApi;
  api.defaults.headers["accessToken"] = `Bearer ${accessToken}`;
  api
    .post(
      `/start`,
      JSON.stringify({
        type: type,
        latitude: latitude,
        longitude: longitude,
        crewpingId: crewpingId,
      }),
    )
    .then(success)
    .catch(fail);
};

// 플로깅 기록 일별 조회
const searchPloggingUsingDay = ({
  accessToken,
  start_day,
  end_day,
  success,
  fail,
}: {
  accessToken: string;
  start_day: string;
  end_day: string;
  success: (response: AxiosResponse<any, any>) => void | undefined;
  fail: (error: any) => void | undefined;
}) => {
  const api = ploggingApi;
  api.defaults.headers["accessToken"] = `Bearer ${accessToken}`;
  api.get(`/period/${start_day}-${end_day}`).then(success).catch(fail);
};

// 플로깅 기록 상세 조회
const searchPloggingInfo = ({
  accessToken,
  plogging_id,
  success,
  fail,
}: {
  accessToken: string;
  plogging_id: number;
  success: (response: AxiosResponse<any, any>) => void | undefined;
  fail: (error: any) => void | undefined;
}) => {
  const api = ploggingApi;
  api.defaults.headers["accessToken"] = `Bearer ${accessToken}`;
  api.get(`/${plogging_id}`).then(success).catch(fail);
};

// 플로깅 도움 요청 저장
const saveHelp = ({
  accessToken,
  latitude,
  longitude,
  image,
  context,
  success,
  fail,
}: {
  accessToken: string;
  latitude: number;
  longitude: number;
  image: File;
  context: string;
  success: (response: AxiosResponse<any, any>) => void | undefined;
  fail: (error: any) => void | undefined;
}) => {
  const formData = new FormData();
  formData.append("latitude", `${latitude}`);
  formData.append("longitude", `${longitude}`);
  formData.append("image", image);
  formData.append("context", context);

  const api = ploggingApiForm;
  api.defaults.headers["accessToken"] = `Bearer ${accessToken}`;
  api.post(`/help`, formData).then(success).catch(fail);
};

// 플로깅 도움 요청 지역별 조회
const searchHelpUsingLatLng = ({
  accessToken,
  latitude,
  longitude,
  success,
  fail,
}: {
  accessToken: string;
  latitude: number;
  longitude: number;
  success: (response: AxiosResponse<any, any>) => void | undefined;
  fail: (error: any) => void | undefined;
}) => {
  const api = ploggingApi;
  api.defaults.headers["accessToken"] = `Bearer ${accessToken}`;
  api.get(`/help/${latitude}-${longitude}`).then(success).catch(fail);
};

const savePloggingImage = ({
  accessToken,
  plogging_id,
  image,
  success,
  fail,
}: {
  accessToken: string;
  plogging_id: number;
  image: File;
  success: (response: AxiosResponse<any, any>) => void | undefined;
  fail: (error: any) => void | undefined;
}) => {
  const formData = new FormData();
  formData.append("id", `${plogging_id}`);
  formData.append("image", image);

  const api = ploggingApiForm;
  api.defaults.headers["accessToken"] = `Bearer ${accessToken}`;
  api.post(`/image`, formData).then(success).catch(fail);
};

// 플로깅 주변의 유저 조회
const searchNeighbor = ({
  accessToken,
  latitude,
  longitude,
  success,
  fail,
}: {
  accessToken: string;
  latitude: number;
  longitude: number;
  success: (response: AxiosResponse<any, any>) => void | undefined;
  fail: (error: any) => void | undefined;
}) => {
  const api = ploggingApi;
  api.defaults.headers["accessToken"] = `Bearer ${accessToken}`;
  api.get(`/users/${latitude}-${longitude}`).then(success).catch(fail);
};

// --- 미완성 인 것들 ---

// 봉사 정보 조회
const searchVolInfo = ({
  accessToken,
  success,
  fail,
}: {
  accessToken: string;
  success: (response: AxiosResponse<any, any>) => void | undefined;
  fail: (error: any) => void | undefined;
}) => {
  const api = ploggingApi;
  api.defaults.headers["accessToken"] = `Bearer ${accessToken}`;
  api.get(`/volunteer`).then(success).catch(fail);
};

const registerVolInfo = ({
  accessToken,
  success,
  fail,
}: {
  accessToken: string;
  success: (response: AxiosResponse<any, any>) => void | undefined;
  fail: (error: any) => void | undefined;
}) => {
  const formData = new FormData();

  const api = ploggingApiForm;
  api.defaults.headers["accessToken"] = `Bearer ${accessToken}`;
  api.post(`/volunteer`, formData).then(success).catch(fail);
};

export {
  savePlogging,
  startPlogging,
  searchPloggingUsingDay,
  searchPloggingInfo,
  saveHelp,
  searchHelpUsingLatLng,
  savePloggingImage,
  searchNeighbor,
  searchVolInfo,
  registerVolInfo,
};