var cdPage;
function openCd(){
  try{
      cdPage=OpenFullCd('cd'+getCdPageIndex()+'.do');
  }catch (e) {
      // TODO: handle exception
  }
}

function getCdPageIndex(){
	if(typeof(cdIndex)!= "undefined" ){
		return cdIndex;
	}
	return "2";
}

function closeCd(){
	 if(cdPage && cdPage.open && !cdPage.closed)
    {
		 cdPage.close();
    }
}

function OpenFullCd(path)
{
	if (path == null) return false;
	path = String (path);

	if (path.length <= 0) return false;
	var param = "channelmode=0, directories=0, fullscreen=yes, location=0, menubar=0";
	param += ", resizable=0, scrollbars=no, status=0, titlebar=0, toolbar=0";
	var x=path.indexOf(".");
	var pname=x==-1?"same":path.substring(0,path.indexOf("."));
	var ind=pname.lastIndexOf("/");
	pname=pname.substring(ind+1, pname.length);
   path="http://" + document.domain +"/"+ path;
	var popup = window.open (path, pname, param);
	popup.focus ();
	return popup;
}


function resetThisCd(data){
	if(isResetCdProduct() ){
		var str="";
		var c_photo;
		
      //data=JSON.parse(data);
      var totalFee=0;
      var scoreTotal=0;
      for(var i=0;i<data.length;i++){
         var sid=i;
			var name=data[i].name;
			//var req=data[i].name;
			var price=data[i].price;
			var count=data[i].count;
			var photo=data[i].photo;
			var score=data[i].score;
      
        totalFee+=parseFloat(price)*parseFloat(count);
        scoreTotal+=parseFloat(score);
			//if(req!='')req="("+req+")";
			str+=cdPage.add(sid,name,count,parseFloat(price)*parseFloat(count),score);
			c_photo=photo;
      }
      setPayInfo(totalFee,scoreTotal);
		cdPage.setProductList(str,c_photo);
	}
}


function isResetCdProduct(){
	if(typeof(cdPage)!= "undefined" ){
      var cdIndex=1;
		 if(cdPage && cdPage.open && !cdPage.closed){
			 if(cdIndex=='1')return true;
		} 

	}
	return false;
}


function setPayInfo(cashShouldPay,score){
	
	$("#cashShouldPay").html(cashShouldPay);
	
	$("#recive").html(cashShouldPay);
    
   $("#score").html(score);
}


function initPayInfo(){
	$("#change").html(0.0)
	
	$("#cashShouldPay").html(0.0)
	
	$("#recive").html(0.0)
	
	$("#popu").html("")
}	  
	

