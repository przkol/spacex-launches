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
  id: string
}

export interface LaunchDetailed {
  id: string
  links: {
    article_link: string;
    video_link: string;
    flickr_images: string[]
    presskit: string
    mission_patch: string
  };
  mission_id: string;
  mission_name: string;

  rocket: {
    rocket_name: string;
    rocket_type: string;
    rocket: {
      stages: number
      height: {
        meters: number
      }
      mass: {
        kg: number
      }
      first_flight: string
      first_stage: {
        burn_time_sec: number
        engines: number
        fuel_amount_tons: number
        reusable: boolean
        thrust_sea_level: { kN: number }
      }
      second_stage: {
        burn_time_sec: number
        engines: number
        fuel_amount_tons: number
        thrust: { kN: number }
      }
    }

  };
  ships: {
    home_port: string;
    image: string;
    name: string;
    url: string;
  }[];
  details: string
  launch_date_local: string
  launch_site: {
    site_name_long: string
    site_name: string
  }
}

export interface ListResponse<T> {

  data: { launchesPast: T[] }

}
