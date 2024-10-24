<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%@ page import="java.util.Enumeration" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Map" %>

<%@ include file="security.jsp" %>

<html>
<head>
    <title>Secure Acceptance - Payment Form Example</title>
    <link rel="stylesheet" type="text/css" href="payment.css"/>
</head>
<body>
<form id="payment_confirmation" action="https://testsecureacceptance.cybersource.com/pay" method="post"/>
<%
    request.setCharacterEncoding("UTF-8");
    HashMap params = new HashMap();
    Enumeration paramsEnum = request.getParameterNames();
    while (paramsEnum.hasMoreElements()) {
        String paramName = (String) paramsEnum.nextElement();
        String paramValue = request.getParameter(paramName);
        params.put(paramName, paramValue);
    }
%>
<fieldset id="confirmation">
    <legend>Review Payment Details</legend>
    <div>
        <%
            Iterator paramsIterator = params.entrySet().iterator();
            while (paramsIterator.hasNext()) {
                Map.Entry param = (Map.Entry) paramsIterator.next();
        %>
        <div>
            <span class="fieldName"><%=param.getKey()%>:</span><span class="fieldValue"><%=param.getValue()%></span>
        </div>
        <%
            }
        %>
    </div>
</fieldset>
<%
    paramsIterator = params.entrySet().iterator();
    while (paramsIterator.hasNext()) {
        Map.Entry param = (Map.Entry) paramsIterator.next();
        out.print("<input type=\"hidden\" id=\"" + param.getKey() + "\" name=\"" + param.getKey() + "\" value=\"" + param.getValue() + "\"/>\n");
    }
    out.print("<input type=\"hidden\" id=\"signature\" name=\"signature\" value=\"" + sign(params) + "\"/>\n");
%>
<input type="submit" id="confirm" value="Confirm"/>
</form>
</body>
</html>