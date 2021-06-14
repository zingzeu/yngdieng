load("//assets:ffmpeg.bzl", "batch_mp3_to_wav")
load("@io_bazel_rules_docker//container:container.bzl", "container_image")

# We store TTS audio as mp3 to save space. However the production code requires wav files.
# This target generates the neccessary wav files.
batch_mp3_to_wav(
    name = "gen_mp3",
    srcs = glob(["tts_audio/*.mp3"]),
)

filegroup(
    name = "tts_audio_wav",
    srcs = [":gen_mp3"] + glob(["tts_audio/*.wav"]),
)

# Build this rule for local runs of the server
genrule(
    name = "tts_audio_wav_local",
    srcs = [":tts_audio_wav"],
    outs = ["tts_audio_wav_local"],
    cmd = "mkdir $(OUTS) && cp -r $(SRCS) $(OUTS)",
)

container_image(
    name = "tts_audio_wav_image",
    files = [":tts_audio_wav"],
)
