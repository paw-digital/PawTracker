import * as React from "react";
import { useTranslation } from "react-i18next";
import { Card, Row, Col, Pagination, Skeleton, Typography } from "antd";
import { TrophyTwoTone } from "@ant-design/icons";
import chunk from "lodash/chunk";
import useNanoBrowserQuestLeaderboard from "./hooks/use-nanobrowserquest-leaderboard";
import { getLevel } from "./utils";

const { Text, Title } = Typography;

const Trophy: React.FC<{ rank: number }> = ({ rank }) => {
  let color: null | string = null;
  if (rank === 1) {
    color = "#ffd700";
  } else if (rank === 2) {
    color = "#c0c0c0";
  } else if (rank === 3) {
    color = "#cd7f32";
  }

  return color ? (
    <TrophyTwoTone
      twoToneColor={color}
      style={{ fontSize: fontSizeToRankMap[rank] ?? "auto" }}
    />
  ) : null;
};

const fontSizeToRankMap: { [key: number]: string } = {
  1: "18px",
  2: "18px",
  3: "18px",
};

const Leaderboard: React.FC = () => {
  const { t } = useTranslation();
  const { leaderboard, isLoading } = useNanoBrowserQuestLeaderboard();
  const pageSize = 15;
  const [currentPage, setCurrentPage] = React.useState(1);
  const [paginatedTopScores, setPaginatedTopScores] = React.useState(
    [] as any[][],
  );

  React.useEffect(() => {
    setPaginatedTopScores(chunk(leaderboard, pageSize));
  }, [leaderboard]);

  return (
    <>
      <Title level={3}>{t("pages.nanobrowserquest.leaderboard")}</Title>
      <Card size="small" bordered={false} className="detail-layout">
        <Row gutter={12}>
          <Col xs={4}>{t("pages.nanobrowserquest.rank")}</Col>
          <Col xs={10}>{t("pages.nanobrowserquest.player")}</Col>
          <Col xs={4}>{t("pages.nanobrowserquest.level")}</Col>
          <Col xs={6}>{t("pages.nanobrowserquest.exp")}</Col>
        </Row>
        {isLoading ? (
          Array.from(Array(5).keys()).map(index => (
            <Row gutter={12} key={index}>
              <Col xs={4}>
                <Skeleton loading={true} paragraph={false} active />
              </Col>
              <Col xs={10}>
                <Skeleton loading={true} paragraph={false} active />
              </Col>
              <Col xs={4}>
                <Skeleton loading={true} paragraph={false} active />
              </Col>
              <Col xs={6}>
                <Skeleton loading={true} paragraph={false} active />
              </Col>
            </Row>
          ))
        ) : (
          <>
            {paginatedTopScores[currentPage - 1]?.map(
              ({ rank, player, exp, nanoPotions }) => (
                <Row gutter={12} key={rank}>
                  <Col xs={4}>
                    <Text
                      style={{ fontSize: fontSizeToRankMap[rank] ?? "auto" }}
                    >
                      #{rank} <Trophy rank={rank} />
                    </Text>
                  </Col>
                  <Col xs={10}>
                    <Text
                      style={{ fontSize: fontSizeToRankMap[rank] ?? "auto" }}
                    >
                      {player}
                    </Text>
                  </Col>
                  <Col xs={4}>
                    <Text
                      style={{ fontSize: fontSizeToRankMap[rank] ?? "auto" }}
                    >
                      {getLevel(exp)}
                    </Text>
                  </Col>
                  <Col xs={4}>
                    <Text
                      style={{ fontSize: fontSizeToRankMap[rank] ?? "auto" }}
                    >
                      {exp}
                    </Text>
                  </Col>
                </Row>
              ),
            )}
            <Row className="row-pagination">
              <Col xs={24} style={{ textAlign: "right" }}>
                <Pagination
                  size="small"
                  {...{
                    total: leaderboard.length,
                    pageSize,
                    current: currentPage,
                    disabled: false,
                    onChange: (page: number) => {
                      setCurrentPage?.(page);
                    },
                    showSizeChanger: false,
                  }}
                />
              </Col>
            </Row>
          </>
        )}
      </Card>
    </>
  );
};

export default Leaderboard;
