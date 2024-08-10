import DynamicIframe from "./DynamicIframe";
import { supabase } from '@/utils/supabase';

export async function generateMetadata({ params, searchParams }) {

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

  let ogImageUrl = `https://tour.video/api/og?id=${params?.alias?.replace("%40", "@")}${searchParams?.screen ? `&screen=${searchParams?.screen}` : ""}`;
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
        // {
        //   url: "https://imagedelivery.net/d3WSibrZmE8m_HEZW60OcQ/1bd9561c-0fe2-4dab-52d1-a559785d4c00/original",
        //   width: 400,
        //   height: 208,
        // }
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

// Loader component
const Loader = () => (
  <svg className="animate-spin h-16 w-16 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


export default function AliasPage({ params, searchParams }) {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-40 flex items-center justify-center">
        <Loader />
      </div>
      <DynamicIframe alias={params?.alias} initialSearchParams={searchParams} />
    </div>
  );
}
