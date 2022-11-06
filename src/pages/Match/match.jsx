import { fetchMatch } from "api/apis";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import updateData from "store/data";
import {
  Container,
  TodayMatch,
  TextWrapper,
  IframeContainer,
  ImageContainer,
  Logo,
  MatchCard,
  Name,
  RedTextContainer,
  Team,
  TimingOrScore,
  Title,
  Wrapper,
} from "./match.style";

const Match = () => {
  const { idMatch } = useParams();
  const [index, setIndex] = useState(0);
  const [m, setM] = useState([]);
  const dispatch = useDispatch();

  const get_data = useSelector((state) => state.raw_data) || [];
  useEffect(() => {
    if (get_data.raw_data) {
      setM(get_data.raw_data.filter((item) => item.id === idMatch)[0]);
    } else {
      const sendRequest = async () => {
        try {
          const response = await fetch("https://beinmatchtv.herokuapp.com/api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          console.log(response);
          
          const data = await response.json();
          let loadedItems = [];
          console.log("data", data);
          for (const keyItem in data) {
            loadedItems.push({ id: keyItem, details: data[keyItem] });
          }

          setM(loadedItems.filter((item) => item.id === idMatch)[0]);
          dispatch(updateData(loadedItems));
        } catch (e) {
          console.log(e.message);
        }
      };
      if (index === 0) {
        sendRequest();
        console.log("index", index);
        setIndex(1);
      }
    }
  }, [get_data]);

  const Iframe = styled.iframe`
    padding-right: 20px;
    z-index: 0;
    margin-top: -220px;
  `;
  console.log("m", m);
  return m?.details?.image_team2 ? (
    <Container>
      <TodayMatch>
        <TextWrapper>
          <Title>الصفحة الخاصة بنقل مباراة</Title>
        </TextWrapper>
      </TodayMatch>
      <Wrapper>
        <MatchCard>
          <Team>
            <ImageContainer>
              <Logo src={m.details.image_team2} />
            </ImageContainer>
            <Name direction="left">{m.details.team2}</Name>
          </Team>

          <TimingOrScore>{m.details.state}</TimingOrScore>
          <Team>
            <Name direction="left">{m.details.team1}</Name>
            <ImageContainer>
              <Logo src={m.details.image_team1} />
            </ImageContainer>
          </Team>
        </MatchCard>
        <IframeContainer>
          <div id="PlaceToPutTable"></div>
          <Iframe
            height="800px"
            id="iframe"
            allowfullscreen="AllowFullScreen"
            frameborder="0"
            scrolling=""
            // src={match.Link}
            width="100%"
            src={m.details.match_link}
            scrolling="no"
          ></Iframe>
        </IframeContainer>
      </Wrapper>
    </Container>
  ) : (
    <div>...Loading</div>
  );
};
export default Match;
