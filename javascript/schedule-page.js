const ctx=document.getElementById("ot-usage-chart").getContext('2d');
const chart = new Chart(ctx,{
    type:"bar",
    data:{
        labels:['OT1','OT2','OT3'],
        datasets:[{
            label:"number of surgeries",
            data:[5,10,15],
            backgroundColor:'rgba(175, 192, 199, 0.2)',
            borderColor:'rgba(175, 192, 192, 1)',
            borderWidth:1
            }]
            },
            options:{
                scales:{
                    y:{
                        beginAtZero:true
                    }
                }
            }
})