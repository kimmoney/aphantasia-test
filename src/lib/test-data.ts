export type Dimension = "visual" | "spatial" | "face";

export type Question = {
  id: string;
  dimension: Dimension;
  prompt: string;
  help: string;
  lowLabel: string;
  highLabel: string;
  reverse?: boolean;
};

export const questions: Question[] = [
  {
    id: "familiar-face",
    dimension: "visual",
    prompt: "가까운 사람의 얼굴을 떠올릴 때 눈, 코, 표정의 세부가 어느 정도 보이나요?",
    help: "실제로 사진을 보지 않고 자발적으로 떠올리는 장면만 기준으로 답하세요.",
    lowLabel: "거의 보이지 않음",
    highLabel: "사진처럼 선명함",
  },
  {
    id: "sunrise-scene",
    dimension: "visual",
    prompt: "해가 뜨는 바다를 상상하면 색, 빛, 수평선이 얼마나 또렷하게 느껴지나요?",
    help: "개념적으로 안다는 느낌이 아니라 마음속 시각 경험의 선명도를 평가합니다.",
    lowLabel: "말로만 이해됨",
    highLabel: "장면이 선명함",
  },
  {
    id: "room-memory",
    dimension: "visual",
    prompt: "방금 지나온 방을 떠올릴 때 가구 배치와 물건의 색이 시각적으로 재현되나요?",
    help: "기억 지식이 아니라 시각적인 재현감에 초점을 맞춥니다.",
    lowLabel: "위치만 앎",
    highLabel: "색과 형태가 보임",
  },
  {
    id: "object-rotation",
    dimension: "visual",
    prompt: "빨간 사과를 머릿속에서 회전시키면 표면, 그림자, 방향 변화가 보이나요?",
    help: "정적인 이미지보다 이미지 조작 능력까지 함께 확인합니다.",
    lowLabel: "이미지가 없음",
    highLabel: "회전이 자연스러움",
  },
  {
    id: "voluntary-control",
    dimension: "visual",
    prompt: "원할 때 특정 장면을 만들고, 그 장면을 몇 초 동안 유지할 수 있나요?",
    help: "꿈이나 순간적인 번쩍임이 아니라 의도적으로 만든 이미지 기준입니다.",
    lowLabel: "유지 불가",
    highLabel: "쉽게 유지",
  },
  {
    id: "eyes-open",
    dimension: "visual",
    prompt: "눈을 뜬 상태에서도 간단한 도형이나 색을 마음속에 띄울 수 있나요?",
    help: "많은 사람은 눈 감은 상태와 눈 뜬 상태에서 심상 선명도가 다릅니다.",
    lowLabel: "전혀 어려움",
    highLabel: "쉽게 가능",
  },
  {
    id: "autobiographical-image",
    dimension: "visual",
    prompt: "최근의 인상적인 순간을 떠올리면 실제 장면의 일부가 이미지처럼 돌아오나요?",
    help: "사건 내용을 기억하는 것과 장면을 보는 느낌은 구분해서 답하세요.",
    lowLabel: "내용만 기억",
    highLabel: "장면이 돌아옴",
  },
  {
    id: "dream-contrast",
    dimension: "visual",
    prompt: "꿈에서는 이미지가 있었지만 깨어 있을 때는 같은 방식으로 떠올리기 어렵나요?",
    help: "아판타시아에서도 꿈 이미지는 남아 있을 수 있어 보조 신호로만 반영합니다.",
    lowLabel: "그렇지 않음",
    highLabel: "매우 그렇다",
    reverse: true,
  },
  {
    id: "mental-map",
    dimension: "spatial",
    prompt: "자주 가는 장소의 길을 머릿속 지도처럼 따라가며 설명할 수 있나요?",
    help: "선명한 그림이 없어도 위치 관계를 다루는 능력은 따로 남아 있을 수 있습니다.",
    lowLabel: "위치 관계가 흐림",
    highLabel: "경로가 분명함",
  },
  {
    id: "rotation-fit",
    dimension: "spatial",
    prompt: "조립 부품이나 가구를 돌려 보며 맞는 방향을 머릿속으로 예측할 수 있나요?",
    help: "공간 변환과 방향 예측을 묻는 문항입니다.",
    lowLabel: "매우 어려움",
    highLabel: "쉽게 예측",
  },
  {
    id: "left-right-layout",
    dimension: "spatial",
    prompt: "낯선 건물 안에서도 지나온 방향과 좌우 배치를 비교적 잘 기억하나요?",
    help: "길 찾기와 배치 기억을 함께 평가합니다.",
    lowLabel: "자주 헷갈림",
    highLabel: "대체로 정확",
  },
  {
    id: "face-context",
    dimension: "face",
    prompt: "익숙한 사람도 머리 모양, 옷, 장소 단서가 바뀌면 알아보기 어려운 편인가요?",
    help: "얼굴 자체보다 주변 단서에 의존하는 정도를 확인합니다.",
    lowLabel: "거의 아님",
    highLabel: "자주 그렇다",
  },
  {
    id: "new-face",
    dimension: "face",
    prompt: "처음 만난 사람의 얼굴을 다음 만남에서 기억하는 것이 어렵나요?",
    help: "이름 기억과 별개로 얼굴 학습 경험을 기준으로 답하세요.",
    lowLabel: "쉽게 기억",
    highLabel: "매우 어려움",
  },
  {
    id: "face-imagery",
    dimension: "face",
    prompt: "친한 사람의 얼굴을 말로 설명할 수는 있지만 이미지로 떠올리기는 어렵나요?",
    help: "아판타시아와 얼굴 심상 어려움이 함께 나타나는지 보는 보조 문항입니다.",
    lowLabel: "이미지도 가능",
    highLabel: "설명만 가능",
  },
];

export const scale = [
  "0",
  "1",
  "2",
  "3",
  "4",
] as const;

export const sources = [
  {
    label: "Zeman et al., 2015, Cortex",
    url: "https://doi.org/10.1016/j.cortex.2015.05.019",
  },
  {
    label: "Vividness of Visual Imagery Questionnaire overview",
    url: "https://aphantasia.com/vviq/",
  },
  {
    label: "Cleveland Clinic: Aphantasia",
    url: "https://my.clevelandclinic.org/health/symptoms/25222-aphantasia",
  },
  {
    label: "Shah et al., PI20 face-recognition self-report",
    url: "https://openaccess.city.ac.uk/id/eprint/16738/",
  },
  {
    label: "Kozhevnikov et al., object/spatial imagery distinction",
    url: "https://doi.org/10.3758/BF03195337",
  },
];
