import React, { useState, useEffect, useRef } from "react";
import { naver } from "components/common/useNaver";
import { Coordinate } from "interface/ploggingInterface";
import * as N from "./functions/useNaverMap";

import { useSelector } from "react-redux";
import { rootState } from "store/store";

interface IPathMap {
  subHeight: number;
  paths: Coordinate[];
}

const defaultZoom = 16;

const DefaultPathMap: React.FC<IPathMap> = ({ subHeight, paths }) => {
  const isMapLoaded = useRef<boolean>(false);
  const windowHeight = useSelector<rootState, number>((state) => {
    return state.window.height;
  });
  const [naverPaths, setNaverPaths] = useState<
    naver.maps.Coord[] | naver.maps.CoordLiteral[]
  >([]);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const startRef = useRef<naver.maps.Marker | null>(null);
  const endRef = useRef<naver.maps.Marker | null>(null);
  const polylineRef = useRef<naver.maps.Polyline | null>(null);

  useEffect(() => {
    if (!isMapLoaded.current) {
      setNaverPaths(
        paths.map((path) => {
          return new naver.maps.LatLng(path.latitude, path.longitude);
        }),
      );

      const map = new naver.maps.Map("map", {
        zoom: defaultZoom,
      });
      mapRef.current = map;
    }

    return () => {
      if (!isMapLoaded.current) {
        isMapLoaded.current = true;
      }
    };
  }, []);

  useEffect(() => {
    if (naverPaths[0]) {
      const len = naverPaths.length;
      mapRef.current?.setCenter(naverPaths[0]);
      const start = N.createMarker_small({
        latlng: naverPaths[0],
        map: mapRef.current ?? undefined,
        url: `/images/PloggingPage/start.png`,
        cursor: `default`,
      });
      startRef.current = start;

      const end = N.createMarker_small({
        latlng: naverPaths[len - 1],
        map: mapRef.current ?? undefined,
        url: `/images/PloggingPage/stop.png`,
        cursor: `default`,
      });
      endRef.current = end;

      const polyline = N.createPolyline({
        map: mapRef.current ?? undefined,
        path: naverPaths,
        style: {
          strokeColor: `#0075F2`,
          strokeWeight: 3,
        },
      });
      polylineRef.current = polyline;
    }
  }, [naverPaths]);

  return (
    <div
      style={{
        height: `${(windowHeight - subHeight) / 3}px`,
        width: "100%",
        transition: `all 200ms ease-in-out`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        id="map"
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "2.5%",
          boxShadow: `0 0.3rem 0.3rem #9D9D9D`,
        }}
      ></div>
    </div>
  );
};

export default DefaultPathMap;
