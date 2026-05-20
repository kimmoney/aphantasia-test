import { questions, type Dimension } from "./test-data";

export type Answers = Record<string, number>;

export type ProfileInput = {
  name: string;
  gender: string;
  mbti: string;
};

export type DimensionScore = {
  raw: number;
  percent: number;
  label: string;
  summary: string;
};

export type TestResult = {
  profile: ProfileInput;
  completedAt: string;
  visual: DimensionScore;
  spatial: DimensionScore;
  face: DimensionScore;
  headline: string;
  interpretation: string;
  recommendations: string[];
  dataCollectionEnabled: false;
};

const dimensionLabels: Record<Dimension, string> = {
  visual: "시각 심상",
  spatial: "공간 지각",
  face: "안면 인식",
};

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function scoreDimension(answers: Answers, dimension: Dimension): DimensionScore {
  const values = questions
    .filter((question) => question.dimension === dimension)
    .map((question) => {
      const value = answers[question.id] ?? 0;
      return question.reverse ? 4 - value : value;
    });

  const raw = average(values);
  const percent = Math.round((raw / 4) * 100);

  if (dimension === "face") {
    const difficulty = average(
      questions
        .filter((question) => question.dimension === "face")
        .map((question) => answers[question.id] ?? 0),
    );

    if (difficulty >= 3) {
      return {
        raw: difficulty,
        percent: Math.round((difficulty / 4) * 100),
        label: "안면 인식 어려움 높음",
        summary: "얼굴 자체보다 맥락 단서에 의존하는 경향이 강하게 보고되었습니다.",
      };
    }

    if (difficulty >= 2) {
      return {
        raw: difficulty,
        percent: Math.round((difficulty / 4) * 100),
        label: "안면 인식 주의",
        summary: "얼굴 학습이나 얼굴 심상에서 일부 어려움이 있을 수 있습니다.",
      };
    }

    return {
      raw: difficulty,
      percent: Math.round((difficulty / 4) * 100),
      label: "안면 인식 안정",
      summary: "일상적인 얼굴 인식 어려움은 낮게 보고되었습니다.",
    };
  }

  if (dimension === "visual") {
    if (raw <= 0.75) {
      return {
        raw,
        percent,
        label: "강한 아판타시아 프로파일",
        summary: "자발적 시각 심상이 거의 없거나 매우 희미하다는 응답 패턴입니다.",
      };
    }

    if (raw <= 1.5) {
      return {
        raw,
        percent,
        label: "낮은 시각 심상",
        summary: "시각 이미지를 만들 수는 있어도 흐리거나 유지가 어려운 편입니다.",
      };
    }

    if (raw <= 2.75) {
      return {
        raw,
        percent,
        label: "중간 수준 시각 심상",
        summary: "상황에 따라 시각 심상이 나타나지만 항상 선명하지는 않습니다.",
      };
    }

    return {
      raw,
      percent,
      label: "선명한 시각 심상",
      summary: "자발적으로 떠올리는 이미지가 비교적 또렷하고 유지되는 편입니다.",
    };
  }

  if (raw <= 1.5) {
    return {
      raw,
      percent,
      label: "공간 지각 보조 필요",
      summary: "방향, 배치, 회전 예측에서 부담이 크게 느껴질 수 있습니다.",
    };
  }

  if (raw <= 2.75) {
    return {
      raw,
      percent,
      label: "공간 지각 보통",
      summary: "공간 관계 처리는 가능하지만 복잡한 변환에서는 흔들릴 수 있습니다.",
    };
  }

  return {
    raw,
    percent,
    label: "공간 지각 강점",
    summary: "시각 이미지 선명도와 별개로 위치 관계와 회전 예측이 잘 유지됩니다.",
  };
}

export function calculateResult(profile: ProfileInput, answers: Answers): TestResult {
  const visual = scoreDimension(answers, "visual");
  const spatial = scoreDimension(answers, "spatial");
  const face = scoreDimension(answers, "face");

  const headline =
    visual.raw <= 0.75
      ? "자발적 시각화가 매우 낮은 Aphantasia형 응답입니다."
      : visual.raw <= 1.5
        ? "시각 심상 선명도가 낮은 Hypophantasia형 응답입니다."
        : visual.raw <= 2.75
          ? "상황 의존적인 중간 수준 시각 심상입니다."
          : "시각 심상이 선명한 편입니다.";

  const interpretation =
    `${profile.name || "응답자"}님의 결과는 ${dimensionLabels.visual} ${visual.percent}점, ` +
    `${dimensionLabels.spatial} ${spatial.percent}점, ${dimensionLabels.face} ${face.percent}점입니다. ` +
    "이 검사는 진단 도구가 아니라 자가보고 기반 프로파일링이며, 낮은 시각 심상과 공간 처리 능력은 서로 다르게 나타날 수 있습니다.";

  const recommendations = [
    visual.raw <= 1.5
      ? "기억이나 계획을 할 때 스케치, 체크리스트, 사진 참조처럼 외부 시각 단서를 적극적으로 쓰는 편이 유리합니다."
      : "선명한 심상을 활용하되, 중요한 판단은 실제 자료와 기록으로 교차 확인하는 습관이 좋습니다.",
    spatial.raw >= 2.75
      ? "공간 지각 점수가 높아 시각 심상이 낮아도 길 찾기나 구조 이해는 강점일 수 있습니다."
      : "낯선 공간에서는 지도 저장, 방향 표식, 단계별 동선 메모가 부담을 줄일 수 있습니다.",
    face.raw >= 2
      ? "얼굴 인식 어려움이 반복된다면 이름표, 대화 맥락, 목소리 같은 보조 단서를 의식적으로 함께 저장해 보세요."
      : "안면 인식 관련 어려움은 낮게 나타났습니다. 얼굴 심상과 실제 얼굴 인식은 별개의 능력일 수 있습니다.",
  ];

  return {
    profile,
    completedAt: new Date().toISOString(),
    visual,
    spatial,
    face,
    headline,
    interpretation,
    recommendations,
    dataCollectionEnabled: false,
  };
}
