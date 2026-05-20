"use client";

import { useMemo, useRef, useState, type RefObject } from "react";
import {
  Brain,
  CheckCircle2,
  Download,
  Eye,
  FileDown,
  Map,
  MessageCircle,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { calculateResult, type Answers, type ProfileInput, type TestResult } from "@/lib/scoring";
import { questions, scale, sources, type Dimension } from "@/lib/test-data";

const mbtiTypes = [
  "모름",
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];

const genders = ["응답 안 함", "여성", "남성", "논바이너리", "직접 입력"];

const dimensionMeta: Record<
  Dimension,
  { label: string; icon: typeof Eye; tone: string; description: string }
> = {
  visual: {
    label: "시각 심상",
    icon: Eye,
    tone: "text-rose-700 bg-rose-50 border-rose-200",
    description: "자발적으로 장면, 색, 얼굴, 움직임을 마음속에 만드는 능력",
  },
  spatial: {
    label: "공간 지각",
    icon: Map,
    tone: "text-teal-700 bg-teal-50 border-teal-200",
    description: "이미지 선명도와 별개로 위치, 방향, 회전 관계를 다루는 능력",
  },
  face: {
    label: "안면 인식",
    icon: Brain,
    tone: "text-indigo-700 bg-indigo-50 border-indigo-200",
    description: "얼굴 학습, 맥락 단서 의존, 얼굴 심상 어려움의 보조 신호",
  },
};

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share?: {
        sendDefault: (payload: unknown) => void;
      };
    };
  }
}

function scoreLabel(value: string) {
  const labels = ["없음", "희미함", "중간", "선명", "매우 선명"];
  return labels[Number(value)] ?? value;
}

async function ensureKakaoSdk(key: string) {
  if (typeof window === "undefined") return false;
  if (!key) return false;

  if (!window.Kakao) {
    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>("script[data-kakao-sdk]");
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Kakao SDK load failed")), {
          once: true,
        });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";
      script.dataset.kakaoSdk = "true";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Kakao SDK load failed"));
      document.head.appendChild(script);
    });
  }

  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(key);
  }

  return Boolean(window.Kakao?.Share);
}

export default function Home() {
  const [profile, setProfile] = useState<ProfileInput>({
    name: "",
    gender: "응답 안 함",
    mbti: "모름",
  });
  const [customGender, setCustomGender] = useState("");
  const [answers, setAnswers] = useState<Answers>({});
  const [started, setStarted] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);
  const canStart = profile.name.trim().length >= 1;
  const canFinish = answeredCount === questions.length;

  const normalizedProfile = useMemo(
    () => ({
      ...profile,
      gender: profile.gender === "직접 입력" ? customGender.trim() || "직접 입력" : profile.gender,
    }),
    [customGender, profile],
  );

  const result = useMemo<TestResult | null>(() => {
    if (!canFinish) return null;
    return calculateResult(normalizedProfile, answers);
  }, [answers, canFinish, normalizedProfile]);

  function updateAnswer(id: string, value: string) {
    setAnswers((current) => ({ ...current, [id]: Number(value) }));
  }

  function reset() {
    setStarted(false);
    setAnswers({});
    setShareStatus("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function downloadImage() {
    if (!reportRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    await document.fonts.ready;
    const canvas = await html2canvas(reportRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
    });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `aphantasia-report-${Date.now()}.png`;
    link.click();
  }

  async function downloadPdf() {
    if (!reportRef.current) return;
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);
    await document.fonts.ready;
    const canvas = await html2canvas(reportRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
    });
    const image = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const width = 190;
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(image, "PNG", 10, 10, width, Math.min(height, 277));
    pdf.save(`aphantasia-report-${Date.now()}.pdf`);
  }

  async function share() {
    const title = "Aphantasia Profile Test";
    const text = result
      ? `${normalizedProfile.name}님의 결과: ${result.visual.label} / ${result.spatial.label} / ${result.face.label}`
      : "시각 심상, 공간 지각, 안면 인식 경향을 확인하는 Aphantasia 테스트";
    const url = window.location.href;
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY ?? "";

    try {
      const kakaoReady = await ensureKakaoSdk(kakaoKey);
      if (kakaoReady && window.Kakao?.Share) {
        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title,
            description: text,
            imageUrl: `${window.location.origin}/opengraph-image`,
            link: { mobileWebUrl: url, webUrl: url },
          },
          buttons: [{ title: "테스트 열기", link: { mobileWebUrl: url, webUrl: url } }],
        });
        setShareStatus("카카오톡 공유 창을 열었습니다.");
        return;
      }

      if (navigator.share) {
        await navigator.share({ title, text, url });
        setShareStatus("공유를 완료했습니다.");
        return;
      }

      await navigator.clipboard.writeText(url);
      setShareStatus("공유 링크를 클립보드에 복사했습니다.");
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setShareStatus("공유 링크를 클립보드에 복사했습니다.");
      } catch {
        setShareStatus(`공유 링크: ${url}`);
      }
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f6f1] text-neutral-950">
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto grid min-h-[92vh] max-w-7xl grid-cols-1 gap-10 px-5 py-8 md:grid-cols-[0.92fr_1.08fr] md:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-8">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
              <Sparkles className="h-4 w-4 text-rose-700" />
              <span>Aphantasia Profile Test</span>
            </div>

            <div className="max-w-xl">
              <p className="mb-4 inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800">
                정확한 영문 표기: Aphantasia
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-normal text-neutral-950 sm:text-5xl">
                시각 심상, 공간 지각, 얼굴 인식 경향을 짧게 확인합니다.
              </h1>
              <p className="mt-5 text-base leading-7 text-neutral-600">
                VVIQ 계열 연구와 아판타시아 문헌의 핵심 구성을 참고한 자가점검용
                테스트입니다. 이번 버전은 데이터를 저장하거나 전송하지 않고 브라우저 안에서만
                결과를 계산합니다.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {(Object.keys(dimensionMeta) as Dimension[]).map((dimension) => {
                const item = dimensionMeta[dimension];
                const Icon = item.icon;
                return (
                  <div key={dimension} className={`border p-4 ${item.tone}`}>
                    <Icon className="mb-3 h-5 w-5" />
                    <div className="text-sm font-semibold">{item.label}</div>
                    <p className="mt-2 text-xs leading-5">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center">
            {!started ? (
              <section className="w-full border border-neutral-200 bg-[#fbfaf6] p-5 shadow-sm md:p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">응답자 정보</h2>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      이름, 성별, MBTI는 현재 결과 화면 개인화에만 쓰입니다. 서버 저장은 없습니다.
                    </p>
                  </div>
                  <ShieldCheck className="h-6 w-6 text-teal-700" />
                </div>

                <div className="grid gap-4">
                  <label className="grid gap-2 text-sm font-medium">
                    이름
                    <input
                      value={profile.name}
                      onChange={(event) =>
                        setProfile((current) => ({ ...current, name: event.target.value }))
                      }
                      className="h-12 border border-neutral-300 bg-white px-3 text-base outline-none ring-0 transition focus:border-neutral-950"
                      placeholder="결과지에 표시할 이름"
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium">
                      성별
                      <select
                        value={profile.gender}
                        onChange={(event) =>
                          setProfile((current) => ({ ...current, gender: event.target.value }))
                        }
                        className="h-12 border border-neutral-300 bg-white px-3 text-base outline-none transition focus:border-neutral-950"
                      >
                        {genders.map((gender) => (
                          <option key={gender}>{gender}</option>
                        ))}
                      </select>
                    </label>

                    <label className="grid gap-2 text-sm font-medium">
                      MBTI
                      <select
                        value={profile.mbti}
                        onChange={(event) =>
                          setProfile((current) => ({ ...current, mbti: event.target.value }))
                        }
                        className="h-12 border border-neutral-300 bg-white px-3 text-base outline-none transition focus:border-neutral-950"
                      >
                        {mbtiTypes.map((type) => (
                          <option key={type}>{type}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {profile.gender === "직접 입력" ? (
                    <label className="grid gap-2 text-sm font-medium">
                      성별 직접 입력
                      <input
                        value={customGender}
                        onChange={(event) => setCustomGender(event.target.value)}
                        className="h-12 border border-neutral-300 bg-white px-3 text-base outline-none transition focus:border-neutral-950"
                        placeholder="표시할 값 입력"
                      />
                    </label>
                  ) : null}

                  <button
                    type="button"
                    disabled={!canStart}
                    onClick={() => setStarted(true)}
                    className="mt-2 inline-flex h-12 items-center justify-center gap-2 bg-neutral-950 px-5 text-base font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    테스트 시작
                  </button>
                </div>
              </section>
            ) : (
              <section className="w-full border border-neutral-200 bg-[#fbfaf6] p-5 shadow-sm md:p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">문항 {questions.length}개</h2>
                    <p className="mt-1 text-sm text-neutral-600">{answeredCount}개 응답 완료</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold">{progress}%</div>
                    <div className="mt-1 h-2 w-28 bg-neutral-200">
                      <div className="h-full bg-rose-700" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>

                <div className="grid max-h-[66vh] gap-4 overflow-y-auto pr-1">
                  {questions.map((question, index) => {
                    const meta = dimensionMeta[question.dimension];
                    return (
                      <article key={question.id} className="border border-neutral-200 bg-white p-4">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <span className={`border px-2 py-1 text-xs font-semibold ${meta.tone}`}>
                            {meta.label}
                          </span>
                          <span className="text-xs font-medium text-neutral-500">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold leading-6">{question.prompt}</h3>
                        <p className="mt-2 text-sm leading-6 text-neutral-600">{question.help}</p>
                        <div className="mt-4">
                          <div className="mb-2 flex justify-between text-xs text-neutral-500">
                            <span>{question.lowLabel}</span>
                            <span>{question.highLabel}</span>
                          </div>
                          <div className="grid grid-cols-5 gap-2">
                            {scale.map((value) => (
                              <button
                                key={value}
                                type="button"
                                aria-label={`${question.prompt} ${scoreLabel(value)}`}
                                onClick={() => updateAnswer(question.id, value)}
                                className={`h-12 border text-sm font-semibold transition ${
                                  answers[question.id] === Number(value)
                                    ? "border-neutral-950 bg-neutral-950 text-white"
                                    : "border-neutral-300 bg-[#f7f6f1] text-neutral-700 hover:border-neutral-500"
                                }`}
                              >
                                {value}
                              </button>
                            ))}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>

      {result ? (
        <section className="bg-[#f7f6f1] px-5 py-10 md:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold">결과 리포트</h2>
                <p className="mt-2 text-sm text-neutral-600">
                  이미지와 PDF 다운로드가 가능한 결과지입니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={downloadImage}
                  className="inline-flex h-11 items-center gap-2 border border-neutral-300 bg-white px-4 text-sm font-semibold hover:border-neutral-950"
                >
                  <Download className="h-4 w-4" />
                  이미지
                </button>
                <button
                  type="button"
                  onClick={downloadPdf}
                  className="inline-flex h-11 items-center gap-2 border border-neutral-300 bg-white px-4 text-sm font-semibold hover:border-neutral-950"
                >
                  <FileDown className="h-4 w-4" />
                  PDF
                </button>
                <button
                  type="button"
                  onClick={share}
                  className="inline-flex h-11 items-center gap-2 bg-[#fee500] px-4 text-sm font-semibold text-[#191600] hover:bg-[#f4d900]"
                >
                  <MessageCircle className="h-4 w-4" />
                  카카오 공유
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex h-11 items-center gap-2 border border-neutral-300 bg-white px-4 text-sm font-semibold hover:border-neutral-950"
                >
                  <RotateCcw className="h-4 w-4" />
                  다시
                </button>
              </div>
            </div>

            {shareStatus ? (
              <p className="mb-4 inline-flex items-center gap-2 border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800">
                <Share2 className="h-4 w-4" />
                {shareStatus}
              </p>
            ) : null}

            <Report result={result} reportRef={reportRef} />
          </div>
        </section>
      ) : null}
    </main>
  );
}

function Report({
  result,
  reportRef,
}: {
  result: TestResult;
  reportRef: RefObject<HTMLDivElement | null>;
}) {
  const rows = [
    { key: "visual", title: "Aphantasia 핵심", score: result.visual, icon: Eye },
    { key: "spatial", title: "공간 지각 서브", score: result.spatial, icon: Map },
    { key: "face", title: "안면 인식 서브", score: result.face, icon: Brain },
  ] as const;

  return (
    <div ref={reportRef} className="export-safe bg-white p-5 text-neutral-950 shadow-sm md:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="mb-8 flex items-center justify-between gap-4 border-b border-neutral-200 pb-5">
            <div>
              <p className="text-sm font-semibold text-rose-700">Aphantasia Profile Report</p>
              <h3 className="mt-2 text-3xl font-semibold leading-tight">{result.profile.name}</h3>
            </div>
            <div className="text-right text-sm text-neutral-600">
              <div>{result.profile.gender}</div>
              <div>{result.profile.mbti}</div>
            </div>
          </div>

          <h4 className="text-2xl font-semibold leading-tight">{result.headline}</h4>
          <p className="export-muted mt-4 text-base leading-7 text-neutral-700">
            {result.interpretation}
          </p>

          <div className="export-panel mt-6 border border-neutral-200 bg-[#fbfaf6] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-teal-700" />
              판정 한계
            </div>
            <p className="export-muted text-sm leading-6 text-neutral-600">
              이 결과는 의학적 또는 심리학적 진단이 아닙니다. 자기보고 기반 경향 분석이며,
              일상 기능이나 신경학적 증상으로 어려움이 크다면 전문가 평가가 필요합니다.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {rows.map(({ key, title, score, icon: Icon }) => (
            <div key={key} className="export-panel border border-neutral-200 bg-[#fbfaf6] p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-neutral-700" />
                  <span className="font-semibold">{title}</span>
                </div>
                <span className="text-2xl font-semibold">{score.percent}</span>
              </div>
              <div className="export-bar-track h-3 bg-neutral-200">
                <div
                  className="export-bar-fill h-full bg-neutral-950"
                  style={{ width: `${score.percent}%` }}
                />
              </div>
              <div className="mt-3 text-sm font-semibold">{score.label}</div>
              <p className="export-muted mt-2 text-sm leading-6 text-neutral-600">
                {score.summary}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 border-t border-neutral-200 pt-6 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <h4 className="text-lg font-semibold">개인화 제안</h4>
          <div className="mt-3 grid gap-3">
            {result.recommendations.map((recommendation) => (
              <div
                key={recommendation}
                className="export-muted flex gap-3 text-sm leading-6 text-neutral-700"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                <span>{recommendation}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold">근거 자료</h4>
          <div className="mt-3 grid gap-2">
            {sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="export-muted text-sm leading-5 text-neutral-600 underline decoration-neutral-300 underline-offset-4"
              >
                {source.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="export-muted mt-6 border-t border-neutral-200 pt-4 text-xs leading-5 text-neutral-500">
        Data collection: off. This report was calculated locally in the browser.
      </div>
    </div>
  );
}
