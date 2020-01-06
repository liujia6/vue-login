const crypto = require('crypto');
//这里很大的坑就是不能加空格，只能置顶，会报错
//：error:0908F070:PEM routines:get_header_and_data:short header，padding填充方式也要注意，还有buffer格式转换
const pubKey=`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzTQQWP30CXH4cq/oSuu0
CqHtKZLjyFZFJKXfpVhbSqnsYS3lqK91d52qeuxfFN2W8PYn2JvLL1DEvpAbs0/y
VwbWP9Y2bX1Bh4R68lH+a1M+WclwmCxk8i5vt+L0H1M9Jh3ACdN/cYyvnM94Qooi
XwYbHSYZYPME6sytJYHbigFXbl3lzGY3aCW9fClPDicvbfbsyNKFJqMwt16rCW6r
lJ7lJ3kn6hkukefZoZ6odI/ILenMnaeyH9X60oTb2Xy/xK1gRpJQYMJS+08PoXEQ
XmTjBRvJAMX26+N8/GetmPtloMzWFNwcWL6R6L/XAmM3B8bWpoAA+07GmjRzbDry
HQIDAQAB
-----END PUBLIC KEY-----`;
const prvKey=`-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEAzTQQWP30CXH4cq/oSuu0CqHtKZLjyFZFJKXfpVhbSqnsYS3l
qK91d52qeuxfFN2W8PYn2JvLL1DEvpAbs0/yVwbWP9Y2bX1Bh4R68lH+a1M+Wclw
mCxk8i5vt+L0H1M9Jh3ACdN/cYyvnM94QooiXwYbHSYZYPME6sytJYHbigFXbl3l
zGY3aCW9fClPDicvbfbsyNKFJqMwt16rCW6rlJ7lJ3kn6hkukefZoZ6odI/ILenM
naeyH9X60oTb2Xy/xK1gRpJQYMJS+08PoXEQXmTjBRvJAMX26+N8/GetmPtloMzW
FNwcWL6R6L/XAmM3B8bWpoAA+07GmjRzbDryHQIDAQABAoIBAQCuJihVjjjEp0/F
7VoD82NZvrCqnrnntKd7gbZ6+bCIfgtZMf19GmNjv5AGQII1EBXgq9eHMjjPEAnY
/C42EHxHtUqw5JhOdYXef+Vjr4hvBzecNaPz0YFeM2Cmu9qYlykHJypqbG71LAOB
3mVeeyLOaD0skL/rEnOy3T943Gs4A4IqvfMbirRlh6C3sk8l33m51GQhVcslcqlT
MyY3dD1acgxOfMaF1+oSpH6AotH3/aZMcdbGfbRPORCf5Lwm72lHZBDo7HEa7aLq
Zv4BaNl03r+K8soa0kmHXOI2qmSSdi8DaDKwvdLfs41LD4jnFuwU+1XADYNZcI6N
ob4GC4PBAoGBAP81oJVNaRmLJpgBRmatDyx9a2SIiQK9LneVqSSKzFSnRQZmAHb7
B1MXlNmyU+iJgYwKoD17RKMnYWDlXqwozXqWMFqNaZnLMf4MNQhYcWlnViblZ97n
tCAQHCfjdjfyHIIS7aRpGEB8AiLbrVGSVZU9y2jKGjbV9cI5Xx4QRTjtAoGBAM3W
yIu7KUjs6t2WmW9SWSyjmuRLH1K0ETs3De7WCcObzDxTulSxKSzbO3z+yuRSeMhR
jbFJAHNBZLfI2H3kbkKWKLLejNPOK2YgA/TYPvMjHTQ4U3DRQq6XOTX5yyxAp2/8
XBf4MiRwxH5D0XPR9FR1b+E6FwCrksgU2ZHNrWfxAoGABY+RlC8/nwLdMGq2sf4L
WpjRAjvHYHvmy0xDhzxO/3k1k9IdKHqHylO1NpkgIuz8GaURoMVS1YtCH+5fhbjN
4WHsY8y5BFTdHf/+F9R1hCpwQiC1hrHdxuUS9/uI0+c+n8bxzqdLk/wfv8qxmBls
K/hQulPNBmzbEgRWAj2whHECgYEAvW2kMbOUUuB1ZGdr3N7T4hjOOrpHoTzFftEz
qVCgu7ttQTdsivRfCEDZhjaVUXn0XaVv2G9uUqMjpV7YnULTlcPKwJG+2E0r81gT
TAiWJftyrNQJNhHeY/4XUG0JZTg63vxHZGes/YwpyGlxID1ftTo+M+/Zq2w6MJe/
gkbeBoECgYEAjHe+1eLzeoeiuDM2yBzOCXP4KXTtADBeiiYR9OV06xjP75/0VjHD
/2ESI2RI3rD2kWjVWvkqIiDgHVqaMiyl4zZ3L+HIr/hUUjhUCJpAkB+5liLHt6VP
STbarexCkZzgQxctD9ZOP6rXFKJKoeEGG4qPB9qGhjYF31EYuZvMduA=
-----END RSA PRIVATE KEY-----`
class RSAKey{
    getPubKey(){
        return pubKey;
    }
    privateDecrypt(message){
        let textBuffer= new Buffer(message, "base64"); // jsencrypt 库在加密后使用了base64编码,所以这里要先将base64编码后的密文转成buffer
        let decryptText= crypto.privateDecrypt({
            key:prvKey, // 如果通过文件方式读入就需要用new Buffer（）转成buffer
            padding: crypto.constants.RSA_PKCS1_PADDING // 因为前端加密库使用的RSA_PKCS1_PADDING标准填充,所以这里也要使用RSA_PKCS1_PADDING 
        }, textBuffer).toString();
        // console.log(decryptText);
        return decryptText;
    }
}

module.exports = new RSAKey();

