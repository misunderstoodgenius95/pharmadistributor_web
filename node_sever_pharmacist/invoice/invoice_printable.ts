
const PDFDocument = require('pdfkit');
const fs=require('fs');

export function create_printable(invoice_info,society_info,order_details,farmacia_info,headers) {
  const doc = new PDFDocument({
      size: 'A4',
      layout: 'portrait',
      margin: 72
  });
  let index=0;
  let start_x=120;
  let start_y=70;
  let start_box_target_x=50;
  let start_box_target_y=180;
  Object.entries(society_info).forEach(([key,value])=>{
      if(key === 'image'){
          doc.image(value,50,50,{width:60,height:60} );
      }
      const y=start_y+
      doc.text(key+": "+value,start_x,start_y+index).fontSize(10);
      index+=20;


  });



// Border And Target Client
 doc.text("Cliente:",start_box_target_x,start_box_target_y);
  doc.rect(50,200,280,100).strokeColor('black').stroke();
  let index_target=22;
Object.entries(farmacia_info).forEach(([key,value])=>{

    doc.text(key+": "+value,start_box_target_x+5,start_box_target_y+index_target);
    index_target+=20;

});
    doc.text("Numero Fattura: "+invoice_info.invoice_number,400,70);
    doc.text("Emissione Fatura: "+invoice_info.emission_data,400,90);
  const startX = 50;
  const startY = 260;
  const rowHeight = 25;
  const colWidth = 120;
// Line Text


    doc.moveTo(50,320).lineTo(600,320).stroke();
    const colPositions = [50, 120, 200, 280, 350, 420, 490, 550];

// Header
    headers.forEach((item, index) => {
        doc.text(item, colPositions[index], 330);
    });

// Data rows
    let o_details_y = 350;
    order_details.forEach((item, rowIndex) => {
        const values = [item.id, item.nome, item.tipologia, item.misura, item.quantity, item.price, item.vat_percent, item.subtotal];
        values.forEach((value, colIndex) => {
            doc.text(value.toString(), colPositions[colIndex], o_details_y + (rowIndex * 20));
        });
    });
const summary_y=700;
    doc.moveTo(50,summary_y).lineTo(600,summary_y).stroke();
    doc.text("Subtotale: € "+invoice_info.subtotal,50,710);
    doc.text("IVA: € "+invoice_info.vat,50,730);
    doc.text("Totale:€ " +invoice_info.total,50,750);
  const stream=fs.createWriteStream("output.pdf");
  doc.pipe(stream);
  doc.end();
}

// Draw headers

















// Draw headers

/*

*/

