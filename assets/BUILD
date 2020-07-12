load("//assets:ffmpeg.bzl", "batch_mp3_to_wav")

# We store TTS audio as mp3 to save space.
# However the production code needs wav files.

batch_mp3_to_wav(
    name = "tts_audio_wav",
    srcs = glob(["tts_audio/*.mp3"]),
)
