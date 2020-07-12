def batch_mp3_to_wav(name, srcs, **kwargs):
    """
    Converts a list of mp3 files to wav files using ffmpeg.
    """
    native.genrule(
        name = name,
        srcs = srcs,
        outs = [s.replace(".mp3", ".wav") for s in srcs],
        cmd = " ".join([
            "ffmpeg -i $(location %s) $(location %s);" %
            (input, input.replace(".mp3", ".wav"))
            for input in srcs
        ]),
        **kwargs
    )
