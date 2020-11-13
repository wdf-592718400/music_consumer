import {get, post} from './http'

// 判断管理员是否登录成功
export const getLoginStatus = (params) => post(`admin/login/status`, params);

/*********************************************歌手相关 */
// 查询歌手
export const getAllSinger = () => get(`singer/allSinger`);

// 添加歌手
export const setSinger = (params) => post(`singer/add`, params);

// 编辑歌手
export const updateSinger = (params) => post(`singer/update`, params);

// 删除歌手
export const delSinger = (id) => get(`singer/delete?id=${id}`);

/************************************************歌曲相关 */
// 查询歌曲
export const getAllSong = () => get(`song/allSong`);

// 根据歌手ID查询歌曲
export const songOfSingerId = (id) => get(`song/singer/detail?singerId=${id}`);

// 编辑歌曲
export const updateSong = (params) => post(`song/update`, params);

// 删除歌曲
export const delSong = (id) => get(`song/delete?id=${id}`);

// 根据歌曲 ID 查询歌曲对象
export const songOfSongId = (id) => get(`song/detail?id=${id}`);

// 根据歌曲名获取歌曲 ID
export const songOfSongName = (songName) => get(`song/songOfSongName?songName=${songName}`);

// 查询歌曲
export const allSongOfSelect = (id) => get(`song/allSongOfSelect?id=${id}`);

/*********************************************歌单相关 */
// 查询歌单
export const getAllSongList = () => get(`song/list/allSongList`);

// 添加歌单
export const setSongList = (params) => post(`song/list/add`, params);

// 编辑歌单
export const updateSongList = (params) => post(`song/list/update`, params);

// 删除歌单
export const delSongList = (id) => get(`song/list/delete?id=${id}`);

/*********************************************歌单的歌曲相关 */
// 添加歌单
export const listSongOfSongListId = (songListId) => get(`list/song/detail?songListId=${songListId}`);

// 给歌单增加歌曲
export const listSongAdd = (params) => post(`list/song/add`, params);

// 删除歌单
export const delListSong = (songId, songListId) => get(`list/song/delete?songId=${songId}&songListId=${songListId}`);

/*********************************************用户相关 */
// 查询用户
export const getAllConsumer = () => get(`consumer/allConsumer`);

// 添加用户
export const setConsumer = (params) => post(`consumer/add`, params);

// 编辑用户
export const updateConsumer = (params) => post(`consumer/update`, params);

// 删除用户
export const delConsumer = (id) => get(`consumer/delete?id=${id}`);

export const getUserOfId = (id) => get(`consumer/selectByPrimaryKey?id=${id}`);

/*********************************************收藏相关 */
// 指定用户的收藏列表
export const getCollectOfUserId = (userId) => get(`collect/collectOfUserId?userId=${userId}`);
// 删除用户收藏的歌曲
export const deleteCollection = (userId, songId) => get(`collect/delete?userId=${userId}&songId=${songId}`);

/*********************************************评论相关 */
// 指定用户的评论列表
export const getCommentOfSongListId = (songListId) => get(`comment/commentOfSongListId?songListId=${songListId}`);
// 删除用户评论
export const deleteComment = (id) => get(`comment/delete?id=${id}`);