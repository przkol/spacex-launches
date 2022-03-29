import { useEffect, useState } from "react";
import { LaunchShort, ListResponse } from "../types/types";
import axios from "axios";

export default function useRequestLaunches(
  searchValue: string = '',
  pageNo: number = 0,
  launchesPerPage: number = 10
)
  : {
    newLaunches: LaunchShort[],
    error: boolean,
    moreLaunchesAvailable: number,
    loadingFlag: boolean
  } {
  const spacexUrl = "https://api.spacex.land/graphql/";
  const [loadingFlag, setLoadingFlag] = useState<boolean>(false)
  const [newLaunches, setNewLaunches] = useState<LaunchShort[]>([])
  const [error, setError] = useState<boolean>(false)
  const [moreLaunchesAvailable, setMoreLaunchesAvailable] = useState<number>(0)


  useEffect(() => {

    setLoadingFlag(true)
    const offset = pageNo * launchesPerPage;
    let cancel: any;

    const query = `query {
      launchesPast(limit: ${launchesPerPage},offset: ${offset},find: { mission_name: "${searchValue}" }) {
        launch_site {
          site_name_long
          site_name
        }
        launch_date_utc
        rocket {
          rocket_name
        }
        links {
          article_link
          video_link
          flickr_images
          presskit
        }
        details
        mission_name
        id
      }
    }
  
  `
    if (newLaunches.length <= launchesPerPage * pageNo + launchesPerPage ||
      newLaunches.filter((launch) =>
        launch.mission_name.toLowerCase().includes(searchValue.toLowerCase()))
        .length <= launchesPerPage * pageNo + launchesPerPage) {
      axios.request<ListResponse<LaunchShort>>({
        method: "post",
        url: spacexUrl,
        timeout: 10000,
        headers: { "Content-Type": "application/json" },
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
        data: { query: query }
      })
        .then((response) => {
          const filteredLaunches = response.data.data.launchesPast.filter(resLaunch => {
            return (!newLaunches.some(newLaunch => newLaunch.id === resLaunch.id))
          }
          )

          setNewLaunches([...newLaunches, ...filteredLaunches])
          setLoadingFlag(false)
          setError(false)
          setMoreLaunchesAvailable(response.data.data.launchesPast.length)
        })
        .catch((err) => {
          if (axios.isCancel(err)) return;
          console.error(err);
          setError(true)
        });
      return () => cancel();
    } else return
  }, [pageNo, searchValue, launchesPerPage])

  return { newLaunches, error, moreLaunchesAvailable, loadingFlag }


}