"use client";

import { useEffect, useMemo, useState } from "react";
import { useTina } from "tinacms/dist/react";
import { CaseStudyView } from "@/components/case-study/CaseStudyView";
import type { CaseStudy } from "@/content/case-studies/_schema";
import { mapTinaCaseStudy } from "@/lib/tina-mappers";

type TinaPayload = {
  query: string;
  variables: object;
  data: { caseStudy: Record<string, unknown> };
};

type CaseStudyClientProps = {
  slug: string;
  fallbackStudy: CaseStudy;
  next?: CaseStudy;
};

function CaseStudyTina({
  payload,
  next,
}: {
  payload: TinaPayload;
  next?: CaseStudy;
}) {
  const { data } = useTina(payload);
  const study = useMemo(
    () =>
      mapTinaCaseStudy(data.caseStudy as unknown as Record<string, unknown>),
    [data.caseStudy],
  );
  return <CaseStudyView study={study} next={next} />;
}

export function CaseStudyClient({
  slug,
  fallbackStudy,
  next,
}: CaseStudyClientProps) {
  const [payload, setPayload] = useState<TinaPayload | null>(null);

  useEffect(() => {
    let cancelled = false;

    void import("@/tina/__generated__/client")
      .then(({ client }) =>
        client.queries.caseStudy({ relativePath: `${slug}.json` }),
      )
      .then((res) => {
        if (cancelled || !res?.data?.caseStudy) return;
        setPayload({
          query: res.query,
          variables: res.variables,
          data: {
            caseStudy: res.data.caseStudy as unknown as Record<string, unknown>,
          },
        });
      })
      .catch(() => {
        /* Tina GraphQL unavailable — keep JSON fallback */
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!payload) {
    return <CaseStudyView study={fallbackStudy} next={next} />;
  }

  return <CaseStudyTina payload={payload} next={next} />;
}
