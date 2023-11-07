function init() {
  produkDatatable = $("#tableProduk").DataTable();
 $("#tableModalBahan").DataTable();
  //   bahanDatatable = bahanTable.DataTable()
  //   selectedBahanDatatable = selectedBahanTable.DataTable()

  fetchProduk();
  //   fetchBahan()
}

function addProduct(){
  $("#productModal").modal("hide");
  $("#addProduct").modal("show");
  $("#formAddProduct").on("submit", function (e) {
    e.preventDefault();
    var kode = $("#kodeProdukAdd").val();
    var nama = $("#namaProdukAdd").val();
    var kategori = $("#categoryAdd").val();
    var price = $("#hargaProdukAdd").val();
    var quantity = 0;
    var description = $("#descriptionAdd").val();

    $.ajax({
      url: "http://localhost/mentoring/Tugas-Mentoring-19-API/api/v2/products",
      method: "POST",
      dataType: "json",
      data: {
        code_product: kode,
        product_name: nama,
        category_id: kategori,
        price: price,
        quantity: quantity,
        description: description,
      },
      success: function (response) {
        if (response.data.status === true) {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Produk berhasil ditambahkan.",
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              $("#addProduct").modal("hide");
              $("#formAddProduct").trigger("reset");
              fetchProduk();
              $("#productModal").modal("show");
            }
          });
        } else {
          console.error("Gagal menambahkan produk: Status false.");
        }
      },
      error: function (xhr, status, error) {
        console.error("Gagal menambahkan produk: " + error);
      },
    });
  });
}

// Fetchings
var produk = [];
function fetchProduk() {
  $.ajax({
    url: "http://localhost/mentoring/Tugas-Mentoring-19-API/api/v2/products",
    method: "GET",
    dataType: "json",
    success: function (response) {
      if (response.data.status === true) {
        var data = response.data.data;

        produkDatatable.clear();

        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          var id = item.product_id;
          var kode = item.code_product;
          var nama = item.product_name;

          produk.push({ kode, nama, id });

          produkDatatable.row.add([
            kode,
            nama,
            `<button class="btn btn-sm btn-warning text-white btnProduk" onclick="selectProduk('${id}')"><i class="fa fa-plus"></i></button>
            <button class="btn btn-sm btn-danger btnProduk" onclick="hapusProduk('${id}')"><i class="fa fa-trash"></i></button>`,
          ]);
        }

        produkDatatable.draw();
      } else {
        console.error("Gagal mengambil data: Status false.");
      }
    },
    error: function (xhr, status, error) {
      console.error("Gagal mengambil data: " + error);
    },
  });
}

function selectProduk(kode) {

  var selectedProduk = produk.find(function (item) {
    return item.id === kode;
  });

  if (selectedProduk) {
    document.getElementById("kodeProduk").value = selectedProduk.kode;
    document.getElementById("namaProduk").value = selectedProduk.nama;
    document.getElementById("idProduk").value = selectedProduk.id;

    $.ajax({
      url:
        "http://localhost/mentoring/Tugas-Mentoring-19-API/api/v2/ingredients/" + kode,
      method: "GET",
      dataType: "json",
      success: function (response) {
            var data = response.data.data;
            var bahanTabel = $("#tableBahan");
            var tbody = bahanTabel.find("tbody");
            $("#tableBahan #bodyBahan").empty();

        if(data !== undefined) {
        
            tbody.empty();
        
            data.forEach(function (bahan) {
                // Buat baris baru dalam tabel
                var newRow = $("<tr>");
            
                newRow.append("<td>" + bahan.code + "</td>");
                newRow.append("<td>" + bahan.name + "</td>");
                newRow.append("<td>" + `
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">Qty</span>
                        <input type="text" disabled data-row="` + bahan.id +`" value="` + bahan.amount +`" id="inputJumlah" class="form-control validateJumlah" placeholder="Qty">
                    </div>` + "</td>");
                newRow.append("<td class='text-center'>" + `<button class="btn btn-danger hapusBahan" type="button">X</button>` + "</td>");
            
                tbody.append(newRow);
            });
        }
        $("#productModal").modal("hide");
        $("#jumlahProduk").focus();
      },
      error: function (xhr, status, error) {
        $("#productModal").modal("hide");
        Swal.fire({
            icon: "danger",
            title: "Opps...",
            text: "Gagal mengambil data bahan produk.",
            showConfirmButton: true,
          });
      },
    });
  } else {
    Swal.fire({
        icon: "danger",
        title: "Opss..",
        text: "Produk tidak ditemukan.",
        showConfirmButton: true,
      });
  }
}

function hapusProduk(kode) {
  var idProduk = $("#idProduk").val();
  if(idProduk === kode) {
    Swal.fire({
      icon: "warning",
      title: "Produk Sedang dipilih",
      text: "Mohon pilih produk lain terlebih dahulu sebelum menghapus produk ini.",
      showConfirmButton: true,
    });
  }else{
    Swal.fire({
      icon: "warning",
      title: "Hapus Produk",
      text: "Apakah anda yakin ingin menghapus produk ini?",
      showConfirmButton: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url:
            "http://localhost/mentoring/Tugas-Mentoring-19-API/api/v2/products/" +
            kode,
          method: "DELETE",
          dataType: "json",
          success: function (response) {
            if (response.status === true) {
              Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Produk berhasil dihapus.",
                showConfirmButton: true,
              }).then((result) => {
                if (result.isConfirmed) {
                  fetchProduk();
                }
              });
            } else {
              console.error("Gagal menghapus produk: Status false.");
            }
          },
          error: function (xhr, status, error) {
            console.error("Gagal menghapus produk: " + error);
          },
        });
      }
    });
  }
}

$(document).ready(function () {
  init();
  $('#hargaProdukAdd').on("input", function () {
    var inputValue = $(this).val();
    var numericValue = inputValue.replace(/[^0-9]/g, "");
    $(this).val(numericValue);
  });
  $("#bahanModals").click(function () {
    var produkValue = $("#namaProduk").val();

    if (produkValue.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Produk Kosong",
        text: "Mohon pilih produk terlebih dahulu sebelum menambahkan bahan.",
        showConfirmButton: true,
      });
    } else {
      $("#bahanModal").modal("show");
    }
  });

  $(".btnProduk").click(function () {
    var kode = $(this).data("kode");
    var nama = $(this).data("nama");

    // Isi input teks pada halaman utama dengan data produk
    $("#kodeProduk").val(kode);
    $("#namaProduk").val(nama);

    $("#productModal").modal("hide");

    $("#jumlahProduk").focus();
  });

  $(".btnBahan").click(function () {
    var kode = $(this).data("kode");
    var nama = $(this).data("nama");
    var jumlah = $(this).data("jumlah");

    // Isi input teks pada halaman utama dengan data produk
    $("#kodeBahan").val(kode);
    $("#namaBahan").val(nama);
    $("#jumlahBahan").val(jumlah);

    $("#bahanModal").modal("hide");
  });

  $("#tambahBahan").click(function () {
    var kode = $("#kodeBahan").val();
    var nama = $("#namaBahan").val();
    var jumlah = $("#jumlahBahan").val();

    if (kode.trim() !== "" || nama.trim() !== "" || jumlah.trim() !== "") {
      let isDuplicate = false;
      $("#tableBahan #bodyBahan tr").each(function () {
        var kodeBahan = $(this).find("td:eq(0)").text();
        if (kodeBahan === kode) {
          isDuplicate = true;
          return false;
        }
      });
      var nextRowNumber = 1;
      if (!isDuplicate) {
        var table =
          "<tr>" +
          "<td>" +
          kode +
          "</td>" +
          "<td>" +
          nama +
          "</td>" +
          '<td class="text-center">' +
          '<div class="input-group mb-3">' + '<span class="input-group-text" id="basic-addon1">Qty</span>' +
          '<input type="hidden" value="' + jumlah +'" id="batasStok" class="form-control" placeholder="Qty" aria-label="Username" aria-describedby="basic-addon1">' +
          '<input type="text" data-row="' + nextRowNumber +'" value="1" id="inputJumlah" class="form-control validateJumlah" placeholder="Qty" aria-label="Username" aria-describedby="basic-addon1">' +
          "</div>" +
          "</td>" +
          '<td class="text-center">' +
          '<button class="btn btn-danger hapusBahan" type="button">X</button>' +
          "</td>" +
          "</tr>";
        $("#tableBahan #bodyBahan").append(table);

        $('input[data-row="' + nextRowNumber + '"]').on("input", function () {
          var inputValue = $(this).val();
          var numericValue = inputValue.replace(/[^0-9]/g, "");
          $(this).val(numericValue);
        });

        nextRowNumber++;

        var kode = $("#kodeBahan").val("");
        var nama = $("#namaBahan").val("");
        var jumlah = $("#jumlahBahan").val("");

        if ($("#tableBahan #bodyBahan #empty-data").length > 0) {
          $("#empty-data").hide();
        } else {
          $("#empty-data").show();
        }

        $("#tableBahan #bodyBahan tr").each(function () {
          var row = $(this);
          var inputBahan = row.find("input#inputJumlah");
          var maxInputValue = row.find("input#batasStok").val();

          inputBahan.on("keyup", function () {
            var inputValue = parseInt($(this).val());
            if (inputValue > maxInputValue) {
              Swal.fire({
                icon: "warning",
                title: "Batas input",
                text: "Jumlah yang anda inputkan melebihi stok bahan.",
                showConfirmButton: true,
              });
              $(this).val(maxInputValue);
            }
          });
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Duplikat Bahan",
          text: "Bahan yang anda pilih sudah ada.",
          showConfirmButton: true,
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Bahan Kosong",
        text: "Mohon pilih bahan terlebih dahulu sebelum menambahkan.",
        showConfirmButton: true,
      });
    }
  });

  $("#tableBahan").on("click", ".hapusBahan", function () {
    $(this).closest("tr").remove();
  });

  $(".validateJumlah").on("input", function () {
    var v = $(this).val(),
      vc = v.replace(/[^0-9]/, "");
    vc = v.replace(/[^0-9,]/, "");
    if (v !== vc) [$(this).val(vc)];
  });
});

function modalCetak() {
  $("#tableBahan #bodyBahan #empty-data").remove();
  var namaProduk = $("#namaProduk").val();
  var kodeProduk = $("#kodeProduk").val();
  var jumlahProduk = $("#jumlahProduk").val();

  if (
    namaProduk.trim() === "" ||
    kodeProduk.trim() === "" ||
    jumlahProduk.trim() === ""
  ) {
    Swal.fire({
      icon: "warning",
      title: "Data Produk Belum Lengkap",
      text: "Mohon isi semua data produk sebelum mencetak.",
      showConfirmButton: true,
    });
    return;
  }

  var jumlahBarisBahan = $("#tableBahan #bodyBahan tr").length;

  if (jumlahBarisBahan === 0) {
    Swal.fire({
      icon: "warning",
      title: "Data Bahan Kosong",
      text: "Tabel bahan tidak memiliki data. Mohon tambahkan data bahan sebelum mencetak.",
      showConfirmButton: true,
    });
    return;
  }

  var id = $("#idProduk").val();
  var dataToSend = {
    product_id: id,
    ingredients: []
  };

  $("#tableBahan #bodyBahan tr").each(function () {
    var kodeBahan = $(this).find("td:eq(0)").text();
    var namaBahan = $(this).find("td:eq(1)").text();
    var jumlahBahan = $(this).find("input#inputJumlah").val();

    dataToSend.ingredients.push({
      code: kodeBahan,
      name: namaBahan,
      amount: jumlahBahan
    });
  });

  $.ajax({
    url: 'http://localhost/mentoring/Tugas-Mentoring-19-API/api/v2/ingredients/', 
    method: 'POST',
    data: JSON.stringify(dataToSend),
    contentType: 'application/json',
    success: function (response) {
      console.log(response);
      Swal.fire({
        icon: "success",
        title: "Data berhasil disimpan ke database",
        showConfirmButton: true,
        allowOutsideClick: false 
      }).then((result) => {
        if (result.isConfirmed) {
          cetak();
        }
      });
    },
    error: function (xhr, status, error) {
      // Handle error
      console.error("Gagal menyimpan data ke database: " + error);
      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan data ke database",
        text: error,
        showConfirmButton: true
      });
    }
  });
}

function cetak()
{
  var namaProduk = $("#namaProduk").val();
  var kodeProduk = $("#kodeProduk").val();
  var jumlahProduk = $("#jumlahProduk").val();

  $("#cetakKode").val(namaProduk);
  $("#cetakNama").val(kodeProduk);
  $("#cetakJumlah").val(jumlahProduk);

  var dataBahanTable =
    '<table class="table table-bordered"><thead><tr><th>Kode Bahan</th><th>Nama Bahan</th><th>Jumlah Bahan</th></tr></thead><tbody>';
  $("#tableBahan #bodyBahan tr").each(function () {
    var kodeBahan = $(this).find("td:eq(0)").text();
    var namaBahan = $(this).find("td:eq(1)").text();
    var jumlahBahan = $(this).find("input#inputJumlah").val();
    dataBahanTable +=
      "<tr><td>" +
      kodeBahan +
      "</td><td>" +
      namaBahan +
      "</td><td>" +
      jumlahBahan +
      "</td></tr>";
  });
  dataBahanTable += "</tbody></table>";
  $("#modalDataBahan").html(dataBahanTable);

  $("#cetak").modal("show");

   $("#namaProduk").val("");
   $("#kodeProduk").val("");
   $("#jumlahProduk").val("");
   $("#tableBahan #bodyBahan").empty();
}
