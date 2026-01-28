window.onload = async function () {
    const trackCount = await window.appAPI.trackCount('subtitle') // Requires await call inside async function
    console.log(trackCount)
}