$(document).ready(function () {
    console.log("ready!");
    $('.khanh-loading').hide();
    $('.khanh-loadingne').hide();
    $('.khanh-loadingne2').hide();
    $('#searchBar').hide();
    let showDoctor = false;
    $('#doctorHere').hide();
    $('#map').hide()
    $('#btnInitial').click(() => {
        $('.khanh-loading').show();
        $.get("https://qtr424.herokuapp.com/diseases", function (data) {
            console.log('Load diseases OK')
            $.get("https://qtr424.herokuapp.com/doctors", function (data) {
                console.log('Load doctors OK')
                $('.khanh-loading').hide();
                $('.khanh-will-close').hide();
                $('#searchBar').show()
            });
        });


        $('html, body').animate({
            scrollTop: $("#resultHere").offset().top
        }, 1000);
    })
    $('#btnLive').click(() => {
        $('.khanh-loading').show();
        $.get("https://qtr424.herokuapp.com/diseases", function (data) {
            console.log('Load diseases OK')
            $.get("https://qtr424.herokuapp.com/doctors", function (data) {
                console.log('Load doctors OK')
                $('.khanh-loading').hide();
                $('.khanh-will-close').hide();
                $('#searchBar').show()
            });
        });
    })
    $('#searchBtn').click(() => {
        let searchField = $('#searchInput').val()

        let data = { "searchField": searchField }
        $("#searchResult").empty();
        $('.khanh-loadingne').show();
        $.ajax({
            type: 'PUT',
            url: 'https://qtr424.herokuapp.com/search',
            contentType: 'application/json',
            data: JSON.stringify(data), // access in body
        }).done(function (data) {
            console.log(data);
            $('.khanh-loadingne').hide();
            $('#searchInput').val("")
            for (i in data) {
                let symptoms = "";
                symptoms = symptoms.concat(Object.values(data[i].item.symptoms).map(value => " " + value))
                console.log(symptoms)
                $("#searchResult").append(`
                <div class="card mb-2">
                                <div class="card-body">
                                  <h5 class="card-title">${data[i].item.diseaseName}</h5>
                                  <h6 class="card-subtitle mb-2 text-muted">Triệu chứng</h6>
                                  <p class="card-text">${symptoms}</p>
                                  <a href="${data[i].item.refLink}" class="card-link" target="_blank">Tìm hiểu thêm</a>
                                </div>
                              </div>
                `);
            }
            $('#doctorHere').show();
            $('#btnDoctor').click(() => {
                $('#doctorResult').val("")
                $('.khanh-loadingne2').show();
                
                let resultMap;
                if (window.navigator.geolocation) {
                    window.navigator.geolocation.getCurrentPosition((pos) => {
                        resultMap = pos.coords;
                        console.log(resultMap.latitude)
                        console.log(resultMap.longitude)
                        data = {
                            latitude: resultMap.latitude,
                            longtitude: resultMap.longitude
                        }
                        let plotArray = [];
                        plotArray.push({
                            latitude: resultMap.latitude, longitude: resultMap.longitude, tooltip: "Nhà Của Bạn", icon: "town-hall"
                        })
                        $.ajax({
                            type: 'PUT',
                            url: 'https://qtr424.herokuapp.com/distance',
                            contentType: 'application/json',
                            data: JSON.stringify(data), // access in body
                        }).done(function (doctorData) {
                            console.log(doctorData)
                            for (i in doctorData) {
                                if (doctorData[i].distance >= 10000) {
                                    continue;
                                } else {
                                    plotArray.push({
                                        latitude: doctorData[i].latitude, longitude: doctorData[i].longtitude, tooltip: `Bác sĩ ${doctorData[i].name}`
                                    })
                                    $("#doctorResult").append(`
                <div class="card mb-2">
                                <div class="card-body">
                                  <h5 class="card-title">Bác sĩ ${doctorData[i].name}</h5>
                                  <h6 class="card-subtitle mb-2 text-muted">Thông tin</h6>
                                  <p class="card-text">Khoảng cách: ${parseInt(Math.round(doctorData[i].distance / 1000))} km</p>
                                  <p class="card-text">Địa chỉ: ${doctorData[i].address}</p>
                                  <p class="card-text">Số điện thoại: ${doctorData[i].phone}</p>
                                </div>
                              </div>
                `);

                                }

                            }
                            console.log(plotArray)
                            if (plotArray.length == 1) {
                                $("#doctorResult").append(`
                <p class="mt-5 display-4">Không có bác sĩ nào gần nhà bạn:(</p>
                `);
                            }
                            new Mapkick.Map("map", plotArray);
                            $('.khanh-loadingne2').hide();
                            $('#map').show();

                        })
                            .fail(function (msg) {
                                console.log(msg);
                            })

                    }, (err) => {
                        console.log(err)
                        $("#doctorResult").append(`
                <p class="mt-5 display-4">Không lấy được vị trí của bạn :(</p>
                `);
                    });
                } else {
                    $("#doctorResult").append(`
                <p class="mt-5 display-4">Không lấy được vị trí của bạn :(</p>
                `);
                }
                if (showDoctor != true) {
                    $('#doctorHere').show()
                }
                showDoctor = true

            })


        }).fail(function (msg) {
            console.log(msg);
        })
    })
});

