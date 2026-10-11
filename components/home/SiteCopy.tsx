"use client";

import { useEffect, useMemo, useState } from "react";
import { useTina } from "tinacms/dist/react";
import { site as fallbackSite } from "@/content/site";

type TinaPayload = {
  query: string;
  variables: object;
  data: { site: Record<string, unknown> };
};

type SiteCopyProps = {
  children: (site: typeof fallbackSite) => React.ReactNode;
};

function mergeSite(raw: typeof fallbackSite): typeof fallbackSite {
  return {
    ...fallbackSite,
    ...raw,
    about: {
      ...fallbackSite.about,
      ...(raw.about ?? {}),
    },
    hero: {
      ...fallbackSite.hero,
      ...(raw.hero ?? {}),
    },
  };
}

function SiteCopyTina({
  payload,
  children,
}: {
  payload: TinaPayload;
  children: SiteCopyProps["children"];
}) {
  const { data } = useTina(payload);
  const site = useMemo(
    () => mergeSite(data.site as unknown as typeof fallbackSite),
    [data.site],
  );
  return <>{children(site)}</>;
}

export function SiteCopy({ children }: SiteCopyProps) {
  const [payload, setPayload] = useState<TinaPayload | null>(null);

  useEffect(() => {
    let cancelled = false;

    void import("@/tina/__generated__/client")
      .then(({ client }) =>
        client.queries.site({ relativePath: "site.json" }),
      )
      .then((res) => {
        if (cancelled || !res?.data?.site) return;
        setPayload({
          query: res.query,
          variables: res.variables,
          data: { site: res.data.site as unknown as Record<string, unknown> },
        });
      })
      .catch(() => {
        /* Tina GraphQL unavailable — keep JSON fallback */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!payload) {
    return <>{children(fallbackSite)}</>;
  }

  return <SiteCopyTina payload={payload}>{children}</SiteCopyTina>;
}
