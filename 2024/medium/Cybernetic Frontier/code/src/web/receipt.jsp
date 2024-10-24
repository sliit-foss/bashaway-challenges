<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%@ page import="java.util.Enumeration" %>
<%@ page import="java.util.HashMap" %>

<%@ include file="security.jsp" %>

<html>
<head>
    <title>Secure Acceptance - Payment Form Example</title>
    <link rel="stylesheet" type="text/css" href="payment.css"/>
</head>
<body>

<fieldset id="response">
    <legend>Receipt</legend>
    <div>
        <form id="receipt">
            <%
                HashMap params = new HashMap();
                Enumeration paramsEnum = request.getParameterNames();

                while (paramsEnum.hasMoreElements()) {
                    String paramName = (String) paramsEnum.nextElement();
                    String paramValue = request.getParameter(paramName);
                    params.put(paramName, paramValue);
                    out.print("<span>" + paramName + "</span><input type=\"text\" name=\"" + paramName + "\" size=\"50\" value=\"" + paramValue + "\" readonly=\"true\"/><br/>");
                }

                out.print("<span>Signature Verified:</span><input type=\"text\" name=\"verified\" size=\"50\" value=\"" + params.get("signature").equals(sign(params)) + "\" readonly=\"true\"/><br/>");
            %>
        </form>
    </div>
</fieldset>

</body>
</html>
