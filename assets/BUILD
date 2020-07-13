load("//assets:ffmpeg.bzl", "batch_mp3_to_wav")
load("@io_bazel_rules_docker//container:container.bzl", "container_image")

# We store TTS audio as mp3 to save space. However the production code requires wav files.
# This target generates the neccessary wav files.
batch_mp3_to_wav(
    name = "tts_audio_wav",
    srcs = glob(["tts_audio/*.mp3"]),
)

container_image(
    name = "tts_audio_wav_image",
    files = [":tts_audio_wav"],
)
