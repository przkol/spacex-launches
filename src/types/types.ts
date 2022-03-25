export interface LaunchShort {
  mission_name: string;
  rocket: {
    rocket_name: string;
  }
  launch_site: {
    site_name_long: string
    site_name: string
  }
  launch_date_utc: string
  links: {
    flickr_images: string[]
  }
  details: string
}

export interface LaunchLong {
  mission_name: string;
  links: {
    article_link?: string;
    video_link?: string;
  };
  rocket: {
    rocket_name: string;
    first_stage: {
      cores: {
        core: { reuse_count: number; status: string };
        flight: number;
      }[];
    };
    second_stage: {
      payloads: {
        payload_mass_ks: number;
        payload_mass_lbs: number;
        payload_type: string;
      }[];
    };
  };
  ships: {
    home_port: string;
    image: string;
    name: string;
  }[];
}

interface ListResponse<T> {
  data: { launchesPast: T[] };
}
