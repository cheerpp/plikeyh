setTimeout(init,100);
function init(){
    var obox = document.getElementById('box'),
        aDiv = obox.getElementsByTagName('div');
        
        for (var i = 0; i < aDiv.length; i++) {
            aDiv[i].style.background = "url(img/"+(i+1)+".jpg) center/cover";
            aDiv[i].style.transform = "rotateY("+(i*36)+"deg) translate3d(0,0,350px)";
            aDiv[i].style.transition = "transform 1s "+(aDiv.length-i)*0.2+"s";
        }
    var sX,
        sY,
        nX,
        nY,
        desX = 0,
        desY = 0,
        tX = 0,
        tY = 10,
        index = 0;//滚轮初始值
    document.onmousedown = function(e){
        clearInterval(obox.timer);
        e = e || window.event;
        var sX = e.clientX,
            sY = e.clientY;
            this.onmousemove = function(e){
                e = e || window.event;
                var nX = e.clientX,
                    nY = e.clientY;
                     // 当前点的坐标和前一点的坐标差值
                    desX = nX - sX;
                    desY = nY - sY;
                    tX += desX*0.1; 
                    tY += desY*0.1;

                    obox.style.transform = "rotateX("+(-tY)+"deg) rotateY("+tX+"deg)";
                    sX = nX;
                    sY = nY;
            }
            this.onmouseup = function(){
                this.onmousemove = this.onmouseup = null;
                obox.timer = setInterval(function(){
                    desX *= 0.95;
                    desY *= 0.95;
                    tX += desX*0.1;
                    tY += desY*0.1;
                    obox.style.transform = "rotateX("+(-tY)+"deg) rotateY("+tX+"deg)";
                    if (Math.abs(desX)<0.5 && Math.abs(desY)<0.5) {
                        clearInterval(obox.timer);
                    }
                },13);
            }
        return false;
    }
    
    // 添加触摸事件支持，适配移动设备
    document.addEventListener('touchstart', function(e) {
        clearInterval(obox.timer);
        if (e.touches.length === 1) {
            var touch = e.touches[0];
            var sX = touch.clientX,
                sY = touch.clientY;
                
            document.addEventListener('touchmove', touchMove);
            document.addEventListener('touchend', touchEnd);
            
            function touchMove(e) {
                e.preventDefault(); // 防止页面滚动
                if (e.touches.length === 1) {
                    var touch = e.touches[0];
                    var nX = touch.clientX,
                        nY = touch.clientY;
                    
                    desX = nX - sX;
                    desY = nY - sY;
                    tX += desX * 0.1;
                    tY += desY * 0.1;
                    
                    obox.style.transform = "rotateX("+(-tY)+"deg) rotateY("+tX+"deg)";
                    sX = nX;
                    sY = nY;
                }
            }
            
            function touchEnd() {
                document.removeEventListener('touchmove', touchMove);
                document.removeEventListener('touchend', touchEnd);
                
                obox.timer = setInterval(function(){
                    desX *= 0.95;
                    desY *= 0.95;
                    tX += desX*0.1;
                    tY += desY*0.1;
                    obox.style.transform = "rotateX("+(-tY)+"deg) rotateY("+tX+"deg)";
                    if (Math.abs(desX)<0.5 && Math.abs(desY)<0.5) {
                        clearInterval(obox.timer);
                    }
                },13);
            }
        }
    });
    
    //滚轮放大缩小
    mousewheel(document,function(e){
        e = e || window.event;
        var d = e.wheelDelta/120 || -e.detail/3;
            if (d>0) {
                index-=20;
            }else{
                index+=30;
            }
            (index<(-1050)&&(index=(-1050)));
        document.body.style.perspective = 1000 + index + "px";
    })
    function mousewheel(obj,fn){
        document.onmousewheel===null?obj.onmousewheel=fn:addEvent(obj,"DOMMouseScroll",fn)
    }
    function addEvent(obj,eName,fn){
        obj.attachEvent?obj.attachEvent("on"+eName,fn):obj.addEventListener(eName,fn);
    }
    
    // 图片上传功能
    var uploadBtn = document.getElementById('uploadBtn');
    var imageUpload = document.getElementById('imageUpload');
    var previewContainer = document.getElementById('previewContainer');
    var previewImage = document.getElementById('previewImage');
    var positionSelector = document.getElementById('positionSelector');
    var confirmUpload = document.getElementById('confirmUpload');
    
    // 点击上传按钮触发文件选择
    uploadBtn.addEventListener('click', function() {
        imageUpload.click();
    });
    
    // 监听文件选择变化
    imageUpload.addEventListener('change', function(e) {
        var file = e.target.files[0];
        if (!file) return;
        
        // 检查是否为图片文件
        if (!file.type.match('image.*')) {
            alert('请选择图片文件！');
            return;
        }
        
        // 创建文件读取器并预览图片
        var reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewContainer.style.display = 'block';
            positionSelector.style.display = 'block';
        };
        reader.readAsDataURL(file);
    });
    
    // 确认上传并替换相册中的图片
    confirmUpload.addEventListener('click', function() {
        // 获取选中的单选按钮值
        var selectedRadio = document.querySelector('input[name="imagePosition"]:checked');
        var position = parseInt(selectedRadio.value) - 1;
        
        console.log("选择的位置:", position + 1); // 调试信息
        
        if (position >= 0 && position < aDiv.length) {
            // 替换相册中的图片
            aDiv[position].style.background = "url(" + previewImage.src + ") center/cover";
            
            // 隐藏预览和选择器
            previewContainer.style.display = 'none';
            positionSelector.style.display = 'none';
            
            // 重置文件输入
            imageUpload.value = '';
            
            alert("已成功替换图片" + (position + 1));
        } else {
            alert("选择的位置无效，请重试");
        }
    });
}