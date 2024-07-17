import DynamicIframe from "./DynamicIframe";
import { supabase } from '@/utils/supabase';

export async function generateMetadata({ params, searchParams }) {
  let tempParams = {
    alias: "@vue32",
    cid: 176,
    uuid: ""
  }

  let alias = params?.alias.replace("%40","@") || "";
  let community: any = {};
  let error = null;
  // Fetch the community data using the alias
  // if params alias includes "@" filter by alias, else if alias is just anumber, then filter by id else filter by community_magnets (supabase filter for all)

  if (alias?.includes("@")) {
    alias = alias.replace("@", "");
    const { data: tempCommunity, error: tempError } = await supabase
      .from('Community')
      .select('id, name')
      .eq('alias', alias )
      // get all the community_magnets child elements too
      .single();
    community = tempCommunity;
    error = tempError;

  } else if (!alias?.includes("-") && parseInt(alias)) {
    // alias is id
    const { data: tempCommunity,  error: tempError } = await supabase
      .from('Community')
      .select('id, name')
      .eq('id', alias )
      // get all the community_magnets child elements too
      .single();
    community = tempCommunity;
    error = tempError;

  } else {
    // alias is uuid
    const { data: tempCommunity,  error: tempError } = await supabase
      .from('Community')
      .select('id, name')
      .eq('community_magnets', alias )
      // get all the community_magnets child elements too
      .single();
    community = tempCommunity;
    error = tempError;
  }

  let ogImageUrl = `https://tour.video/api/og?id=${params?.alias?.replace("%40", "@")}${params?.screen ? `&screen=${params?.screen}` : ""}`;
  console.log("ogImageUrlTYG: ", ogImageUrl);

  if (error || !community) {
    return {
      data: { 
        alias: params?.alias,
        ogImage: ogImageUrl,
      },
      title: 'Community Not Found',
    };
  }

  return {
    title: `Virtual Tour - ${community.name}`,
    description: `Take a virtual tour of ${community.name}`,
    openGraph: {
      title: `Virtual Tour - ${community.name}`,
      description: `Take a virtual tour of ${community.name}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Virtual Tour - ${community.name}`,
      description: `Take a virtual tour of ${community.name}`,
      images: [ogImageUrl],
    },
  };
}


export default function AliasPage({ params, searchParams }) {
  return (
    <DynamicIframe alias={params?.alias} initialSearchParams={searchParams} />
  );
}
