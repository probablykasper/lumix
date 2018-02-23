module.exports = (code, err) => {
    console.error(
        `----- =-=-=-=-=-=-=-=- ${code} -=-=-=-=-=-=-=-= -----`,
        "\n",
        err,
        "\n",
        new Error().stack,
        "\n",
        `----- ================ ${code} ================ -----`,
    )
}
