"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssocatedImage = exports.getSignVideo = void 0;
var axios_1 = __importDefault(require("axios"));
var cheerio_1 = __importDefault(require("cheerio"));
var unsplash_js_1 = require("unsplash-js");
var cross_fetch_1 = __importDefault(require("cross-fetch"));
var baseURL = 'https://www.signingsavvy.com/';
var SigningSavvySearch = function (searchTerm) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}); };
var getVideoUrlFromPartialUrl = function (partialurl) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, axios_1.default.get(baseURL + partialurl).then(function (resp) { return __awaiter(void 0, void 0, void 0, function () {
                var html, searchHtml, $, mediaRegex, match, videoUrl;
                return __generator(this, function (_a) {
                    html = resp.data;
                    $ = cheerio_1.default.load(html);
                    mediaRegex = /href="(.*\.mp4)"/;
                    match = html.match(mediaRegex);
                    videoUrl = baseURL + match[1];
                    return [2 /*return*/, videoUrl];
                });
            }); })];
    });
}); };
var getSignVariants = function (html) { return __awaiter(void 0, void 0, void 0, function () {
    var $, variantATags, variantUrls, variantVideoUrls;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                $ = cheerio_1.default.load(html);
                variantATags = $('.signing_header a');
                variantUrls = [];
                variantATags.each(function (index, tag) {
                    if (index !== 0 && tag.attribs.href) {
                        variantUrls.push(tag.attribs.href);
                    }
                });
                return [4 /*yield*/, Promise.all(variantUrls.map(function (url) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, getVideoUrlFromPartialUrl(url)];
                        });
                    }); }))];
            case 1:
                variantVideoUrls = _a.sent();
                return [2 /*return*/, variantVideoUrls];
        }
    });
}); };
var getSignVideo = function (sign) { return __awaiter(void 0, void 0, void 0, function () {
    var mediaRegex, match, videoUrl;
    return __generator(this, function (_a) {
        mediaRegex = /href="(.*\.mp4)"/;
        if (sign.startsWith("sing/")) {
            return [2 /*return*/, axios_1.default.get(baseURL + sign).then(function (resp) { return __awaiter(void 0, void 0, void 0, function () {
                    var html, match, variantUrls, videoData;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                html = resp.data;
                                match = html.match(mediaRegex);
                                videoUrl = baseURL + match[1];
                                return [4 /*yield*/, getSignVariants(html)];
                            case 1:
                                variantUrls = _a.sent();
                                videoData = { videoUrl: videoUrl, variantUrls: variantUrls };
                                return [2 /*return*/, videoData];
                        }
                    });
                }); })];
        }
        return [2 /*return*/, axios_1.default.get(baseURL + "sign/".concat(sign)).then(function (resp) { return __awaiter(void 0, void 0, void 0, function () {
                var html, searchHtml, $, searchResults, searchWords, searchData, videoData_1, variantUrls, videoData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            html = resp.data;
                            $ = cheerio_1.default.load(html);
                            searchResults = $('.search_results');
                            if (!(searchResults.length > 0)) return [3 /*break*/, 1];
                            searchWords = $(searchResults).find('li');
                            searchData = [];
                            videoData_1 = { searchResults: [] };
                            $(searchWords).each(function (index, ele) {
                                var wordUrl = $(ele).find('a').attr('href');
                                var wordDescription = $(ele).find('em').text().replace(/(\(|\))/g, "");
                                videoData_1.searchResults.push({ wordDescription: wordDescription, wordUrl: wordUrl });
                            });
                            return [2 /*return*/, videoData_1];
                        case 1:
                            match = html.match(mediaRegex);
                            videoUrl = baseURL + match[1];
                            return [4 /*yield*/, getSignVariants(html)];
                        case 2:
                            variantUrls = _a.sent();
                            videoData = { videoUrl: videoUrl, variantUrls: variantUrls };
                            return [2 /*return*/, videoData];
                    }
                });
            }); })];
    });
}); };
exports.getSignVideo = getSignVideo;
var serverApi = (0, unsplash_js_1.createApi)({
    accessKey: '9Ylng4OmN4yCU_ywf-7PbqewnSsJ616KtzGhWn9zpEQ',
    fetch: cross_fetch_1.default,
});
var getAssocatedImage = function (searchParam) { return __awaiter(void 0, void 0, void 0, function () {
    var photos;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, serverApi.search.getPhotos({
                    query: searchParam,
                })
                // console.log(photos.response.results[1].urls.regular)
            ];
            case 1:
                photos = _a.sent();
                // console.log(photos.response.results[1].urls.regular)
                return [2 /*return*/, photos.response.results[1].urls.regular];
        }
    });
}); };
exports.getAssocatedImage = getAssocatedImage;
// https://www.signingsavvy.com/media/mp4-sd/14/14151.mp4
// https://www.signingsavvy.com/media/mp4-sd/27/27844.mp4
