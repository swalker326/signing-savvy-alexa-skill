import axios from 'axios';
import cheerio from 'cheerio'
import { createApi } from 'unsplash-js';
import fetch from 'cross-fetch';

const baseURL = 'https://www.signingsavvy.com/'

interface SearchResult {
  wordDescription: string
  wordUrl: string
}
interface SignVideo {
  videoUrl?: string;
  variantUrls?: string[]
  searchResults?: SearchResult[]
}
const SigningSavvySearch = async (searchTerm: string) => {

}

const getVideoUrlFromPartialUrl = async (partialurl: string) => {
  return axios.get(baseURL + partialurl).then(async resp => {
    const html: string = resp.data;
    let searchHtml;
    const $ = cheerio.load(html);
    const mediaRegex = /href="(.*\.mp4)"/
    let match: string[];
    let videoUrl: string;
    match = html.match(mediaRegex);
    videoUrl = baseURL + match[1];
    return videoUrl
  })
}
const getSignVariants = async (html: string) => {
  const $ = cheerio.load(html);
  const variantATags = $('.signing_header a')
  const variantUrls: string[] = [];
  variantATags.each((index, tag) => {
    if (index !== 0 && tag.attribs.href) {
      variantUrls.push(tag.attribs.href)
    }
  })
  const variantVideoUrls = await Promise.all(variantUrls.map(async (url: string) => {
    return getVideoUrlFromPartialUrl(url);
  })
  )
  return variantVideoUrls
}

export const getSignVideo = async (sign: string) => {
  const mediaRegex = /href="(.*\.mp4)"/
  let match: string[];
  let videoUrl: string;
  if (sign.startsWith("sing/")) {
    return axios.get(baseURL + sign).then(async resp => {
      const html: string = resp.data;
      let match: string[];
      match = html.match(mediaRegex);
      videoUrl = baseURL + match[1];
      const variantUrls = await getSignVariants(html);
      const videoData: SignVideo = { videoUrl: videoUrl, variantUrls: variantUrls }
      return videoData
    })
  }
  return axios.get(baseURL + `sign/${sign}`).then(async resp => {
    const html: string = resp.data;
    let searchHtml: string;
    const $ = cheerio.load(html);
    const searchResults = $('.search_results')
    if (searchResults.length > 0) {
      // const topSearch = $(searchResults[0]).find('a').attr('href');
      const searchWords = $(searchResults).find('li');
      let searchData: SearchResult[] = [];
      const videoData: SignVideo = { searchResults: [] };
      $(searchWords).each((index, ele) => {
        const wordUrl = $(ele).find('a').attr('href');
        const wordDescription = $(ele).find('em').text().replace(/(\(|\))/g, "");
        videoData.searchResults.push({ wordDescription, wordUrl })
      })
      return videoData;
    } else {
      match = html.match(mediaRegex);
      videoUrl = baseURL + match[1];
      const variantUrls = await getSignVariants(html);
      // console.log(variantUrls)
      const videoData: SignVideo = { videoUrl: videoUrl, variantUrls: variantUrls }
      return videoData
    }
  })
}

const serverApi = createApi({
  accessKey: '9Ylng4OmN4yCU_ywf-7PbqewnSsJ616KtzGhWn9zpEQ',
  fetch,
})

export const getAssocatedImage = async (searchParam) => {
  const photos = await serverApi.search.getPhotos({
    query: searchParam,
  })
  // console.log(photos.response.results[1].urls.regular)
  return photos.response.results[1].urls.regular
}


// https://www.signingsavvy.com/media/mp4-sd/14/14151.mp4
// https://www.signingsavvy.com/media/mp4-sd/27/27844.mp4