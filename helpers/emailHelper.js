var postmark = require("postmark");

var client = process.env.NODE_ENV === 'prod' ? new postmark.ServerClient("93e07b41-58bd-49b4-9e82-118f7aa6031f"): new postmark.ServerClient("bb8c9014-6162-43e5-9ddd-491caa5b7c23");
var messageStream = process.env.NODE_ENV === 'prod' ? "form-submissions" : "outbound"

module.exports={
    referralForm: function(data, fileupload){

        const htmlEmail =`
        <table>
            <tr><td>Company Name:</td><td>${data.companyname}</td></tr> 
            <tr><td>Contact Name:</td> <td>${data.contactname}</td></tr>
            <tr><td>Phone:</td><td>${data.phone}</td></tr>
            <tr><td>Email:</td><td>${data.email}</td></tr>
            <tr><td>Agent:</td><td>${data.referringagent}</td></tr>
        </table>
        `

        return client.sendEmail({
            "From": "no-reply@cwamsusa.com",
            "To": `${data.email},kerry.doyle@cwams.com,erick.weinstein@cwams.com`,
            "Subject": "Merchant Services Referral Form",
            "HtmlBody": htmlEmail,
            "MessageStream": messageStream,
            "Attachments":[
                {
                    "Name":fileupload.name,
                    "Content":Buffer.from(fileupload.data).toString('base64'),
                    "ContentType":fileupload.mimetype
                }
            ]
        });
    
    }
}
