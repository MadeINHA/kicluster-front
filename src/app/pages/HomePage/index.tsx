import { useLayoutEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Data1, Data2 } from 'types';
import dummy1 from '../../../dummies/data1.json';
import dummy2 from '../../../dummies/data2.json';

const API_KEY = 'sbfmgmnny1';

export function HomePage() {
  const [dataText1, setDataText1] = useState<string>('');
  const [dataText2, setDataText2] = useState<string>('');

  const mapRef = useRef<null | naver.maps.Map>(null);

  const draw = (withDummy?: boolean) => {
    let _data1 = '';
    let _data2 = '';
    if (withDummy) {
      _data1 = JSON.stringify(dummy1);
      _data2 = JSON.stringify(dummy2);
    } else {
      _data1 = dataText1;
      _data2 = dataText2;
    }

    if (_data1) {
      const data1: Data1 = JSON.parse(_data1);
      console.log('data1', data1);
      data1.cluster_list.forEach(cluster => {
        cluster.kickboard_list.forEach(kickboard => {
          new naver.maps.Marker({
            position: { lat: kickboard.lat, lng: kickboard.lng },
            map: mapRef.current ?? undefined,
            icon: {
              content: `<div><div style="width: 40px;height:40px;text-align:center;line-height:40px;background-color:hsl(${
                cluster.cluster_id * Math.floor(360 / data1.max_cluster)
              }, 50%, 50%);opacity:0.5;">${
                cluster.cluster_id
              }</div><div style="border: 20px solid transparent;border-top-color: hsl(${
                cluster.cluster_id * Math.floor(360 / data1.max_cluster)
              }, 50%, 50%);opacity:0.5;"></div></div>`,
              size: new naver.maps.Size(0, 0),
              anchor: new naver.maps.Point(20, 60),
            },
          });
        });
      });
    }

    if (_data2) {
      const data2: Data2 = JSON.parse(_data2);
      console.log('data2', data2);
      data2.result.forEach(value => {
        new naver.maps.Polygon({
          paths: [
            value.coordinateList.map(coordinate => ({
              lat: coordinate.latitude,
              lng: coordinate.longitude,
            })),
          ],
          map: mapRef.current ?? undefined,
          fillColor: `hsl(${
            value.clusterId * Math.floor(360 / data2.max_cluster)
          }, 50%, 50%)`,
          fillOpacity: 0.2,
          strokeColor: `hsl(${
            value.clusterId * Math.floor(360 / data2.max_cluster)
          }, 50%, 50%)`,
          strokeLineJoin: 'round',
          strokeWeight: 3,
        });
      });
    }
  };

  // Load Naver Maps & Create a Map & The Map Settings
  useLayoutEffect(() => {
    if (!document.getElementById('naverMapsScript')) {
      const naverMapsScript = document.createElement('script');
      naverMapsScript.id = 'naverMapsScript';
      naverMapsScript.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${API_KEY}`;
      naverMapsScript.onload = () => {
        const options: naver.maps.MapOptions = {
          center: new naver.maps.LatLng(37.4494317, 126.6548253),
        };

        const map = new naver.maps.Map('map', options);

        map.addListener('mousemove', event => {
          console.log(event.coord._lat, event.coord._lng);
        });

        mapRef.current = map;
      };
      document.head.appendChild(naverMapsScript);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>HomePage</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            columnGap: '16px',
            padding: '32px',
          }}
        >
          <div>킥보드 위치</div>
          <input
            type="text"
            onChange={event => {
              setDataText1(event.currentTarget.value);
            }}
          />
          <div>볼록 껍질</div>
          <input
            type="text"
            onChange={event => {
              setDataText2(event.currentTarget.value);
            }}
          />
          <button
            onClick={() => {
              draw();
            }}
          >
            입력
          </button>
          <button
            onClick={() => {
              draw(true);
            }}
          >
            더미 데이터 표시
          </button>
        </div>
        <div id="map" style={{ width: '100%', height: '100%' }} />
      </div>
    </>
  );
}
