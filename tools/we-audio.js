const audio = wx.createInnerAudioContext();
audio.autoplay = true;
audio.loop = true;
audio.volume = .3;

module.exports = {
    audio
};
